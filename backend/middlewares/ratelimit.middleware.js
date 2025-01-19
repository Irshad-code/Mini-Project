const rateLimit = require("express-rate-limit");

// Create a rate limiter for email verification attempts
const commonLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000,
  message: { error: "Too many  attempts , please try again after an hour." },
});

// Export the rate limiters
module.exports = {
  commonLimiter,
};
