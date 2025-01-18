const validateAndTransformUrlParamRequest =
  (schema) => async (req, res, next) => {
    try {
      // Validate and transform the request query (URL parameters)
      const validQuery = await schema.validate(req.query, {
        abortEarly: false,
      });

      // Replace the original query with the validated one
      req.query = validQuery;

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      return res.status(400).json({
        error: "Validation error",
        message: error.errors,
      });
    }
  };

module.exports = { validateAndTransformUrlParamRequest };
