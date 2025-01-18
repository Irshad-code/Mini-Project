const log4js = require("log4js");
const fs = require("fs");
const logger = log4js.getLogger("Common error from HandleError");
function isEmptyList(obj) {
  return !obj || obj.length == 0 || Object.keys(obj).length == 0;
}
function handleError(res, status, message, error) {
  if (error) {
    if (error.code) {
      logger.info("error passed: ", error);
      return res.status(error.code).json({ error: error.message });
    } else logger.error(`Error: ${message}`, error);
  } else {
    logger.error(`Error: ${message}`);
  }

  // Create a response object with the error message
  const response = {
    error: message,
  };
  // If an error object is provided, include the stack trace in the response
  if (error && error.stack) {
    logger.error(`Error stack: ${error.stack}`);
  }
  // Return the response as JSON with the specified status code
  return res.status(status).json(response);
}
function handleErrorWithFile(req, res, status, message, error) {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      logger.info(err);
    });
  }
  if (error) {
    logger.error(`Error: ${message}`, error);
  } else {
    logger.error(`Error: ${message}`);
  }
  if (error.code) {
    logger.info("error passed: ", error);
    return res.status(error.code).json({ error: error.message });
  }
  // Create a response object with the error message
  const response = {
    error: message,
  };
  // If an error object is provided, include the stack trace in the response
  if (error && error.stack) {
    logger.error(`Error: ${error.stack}`);
  }
  // Return the response as JSON with the specified status code
  return res.status(status).json(response);
}
module.exports = {
  isEmptyList,
  handleError,
  handleErrorWithFile,
};
