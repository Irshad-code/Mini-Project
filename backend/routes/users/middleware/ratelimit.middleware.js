const rateLimit = require("express-rate-limit");

// Create a rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 login attempts per 15 minutes
  message: {
    error: "Too many  attempts , please try again after 15 minutes.",
  },
});

// Create a rate limiter for signup attempts
const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 3 signups per hour
  message: { error: "Too many  attempts , please try again after an hour." },
});

// Create a rate limiter for email verification attempts
const commonLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 5 email verification attempts per hour
  message: { error: "Too many  attempts , please try again after an hour." },
});

// Export the rate limiters
module.exports = {
  loginLimiter,
  signUpLimiter,
  commonLimiter,
};
