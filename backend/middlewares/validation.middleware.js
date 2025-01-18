const log4js = require("log4js");
const logger = log4js.getLogger(" Validation Moddleware");
const mongoose = require("mongoose");
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateId(req, res, next) {
  const id = req.params.id; // Assuming ID is passed as a URL parameter
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
}
const validateAndTransformRequest = (request) => {
  return async (req, res, next) => {
    try {
      // Validate and transform the request body
      logger.debug("before transaformation :", req.body);
      req.body = await request.validate(req.body, {
        stripUnknown: true,
      });
      logger.debug("after transaformation :", req.body);

      next();
    } catch (error) {
      logger.debug(error);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };
};
module.exports = { validateAndTransformRequest, validateId };
