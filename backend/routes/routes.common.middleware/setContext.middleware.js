// Middleware to set context
module.exports = (context) => {
  return (req, res, next) => {
    // Store the context in res.locals
    res.locals.context = context;
    next();
  };
};
