const log4js = require("log4js");
log4js.configure(process.cwd() + "/logs/logingConfigurations/log4js.json");
const logger = log4js.getLogger("requestLogger");

// Custom middleware function to log request and response
function requestLogger(req, res, next) {
  if (req.method === "OPTIONS") {
    return next(); // Skip logging OPTIONS requests
  }
  const start = Date.now();

  // Get the client's IP address (handling proxies if needed)
  const ipAddress = req.headers["x-forwarded-for"] || req.ip;

  // Clone the request body to safely modify it for logging purposes
  const logEntry = {
    method: req.method,
    url: req.originalUrl,
    ipAddress: ipAddress, // Log the IP address
    requestBody: { ...req.body },
  };

  // Remove sensitive fields from the requestBody before logging
  const sensitiveFields = ["password", "confirmPassword", "phoneNumber"]; // Add any sensitive fields here
  for (const field of sensitiveFields) {
    if (logEntry.requestBody[field]) {
      logEntry.requestBody[field] = "[FILTERED]";
    }
  }

  // Extract specific headers from the request
  const specificHeaders = ["authorization", "content-type"]; // Add headers you want to log here
  const filteredHeaders = {};
  for (const header of specificHeaders) {
    if (req.headers[header]) {
      filteredHeaders[header] = req.headers[header];
    }
  }
  logEntry.headers = filteredHeaders;

  // Capture response information
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const contentLength = res.get("Content-Length");

    logEntry.response = {
      statusCode: statusCode,
      duration: duration + "ms",
      contentLength: contentLength || 0,
    };

    // Log the request and response as JSON
    logger.info(JSON.stringify(logEntry));
  });

  next();
}

module.exports = requestLogger;
