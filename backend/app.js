require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const requestLogger = require("./logs/logingConfigurations/requestLogger");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
// Load routes
const usersRouter = require("./routes/users/routes/user.routes");
const collegesRouter = require("./routes/college.routes");
const departmentsRouter = require("./routes/department.routes");

// Load database and cached data
const db = require("./db/db");
const sanitizeInput = require("./middlewares/sanitizeInput");
// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Unhandled exception:", err.stack);
  // Optionally, perform cleanup tasks or restart the server
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "Unhandled rejection at:",
    promise,
    "reason:",
    reason.stack || reason
  );
  // Optionally, perform cleanup tasks or restart the server
});

// Create express app
const app = express();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up middleware
app.use(express.json());
// Apply helmet for all environments
//app.use(helmet());

// Conditionally disable HSTS in development
// if (process.env.NODE_ENV === "production") {
//   app.use(
//     helmet.hsts({
//       maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
//       includeSubDomains: true, // Apply to subdomains
//       preload: true,
//     })
//   );
// } else {
//   // Disable HSTS in development (HTTP)
//   console.log("Running in development mode, no HSTS enforced.");
// }
// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"], // Allow scripts only from trusted sources
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow Google Fonts
//       fontSrc: ["'self'"], // Allow Google Fonts to load fonts
//       imgSrc: ["'self'", "data:"], // Allow images from the external domain, // Limit image sources
//       frameSrc: ["'self'"], // Allow framing from YouTube
//     },
//   })
// );

///////////////////////////////////////
app.use(sanitizeInput);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
// Add request logger middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(requestLogger);
//allow requests from all origin now
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "*", // Allows all origins
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    })
  );
}

app.use("/api/users", usersRouter);
app.use("/api/colleges", collegesRouter);
app.use("/api/departments", departmentsRouter);

// Serve Swagger UI
if (process.env.NODE_ENV === "development") {
  const intorudctionDocSwagger = require("./api-docs/swagger.json");
  const swaggerUi = require("swagger-ui-express");
  const usersSwagger = require("./api-docs/users/swagger.users.json");
  const userAdminSwagger = require("./api-docs/admin-users/swagger.user.admin.json");

  app.use(
    "/api-docs/users",
    swaggerUi.serveFiles(usersSwagger),
    swaggerUi.setup(usersSwagger)
  );
  app.use(
    "/api-docs/admin/users",
    swaggerUi.serveFiles(userAdminSwagger),
    swaggerUi.setup(userAdminSwagger)
  );
  app.use(
    "/api-docs",
    swaggerUi.serveFiles(intorudctionDocSwagger),
    swaggerUi.setup(intorudctionDocSwagger)
  );
}

// Catch-all middleware for 404 errors
if (process.env.NODE_ENV === "development") {
  app.use((req, res) => {
    res.status(404).json({ error: "Requested Resource Not Found" });
  });
}
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
}
// Error handling middleware
app.use((err, req, res) => {
  res.sendFile(path.resolve, __dirname, "public", "index.html");
});
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
