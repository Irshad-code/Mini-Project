const crypto = require("crypto");

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex"); // Generate a 32-byte hex token
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex"); // Hash token for secure storage
};

module.exports = {
  generateToken,
  hashToken,
};
