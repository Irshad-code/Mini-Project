const authorizeRole = (role) => {
  return (req, res, next) => {
    if (
      req.user &&
      (req.user.role === role || req.user.role === "SUPER_USER")
    ) {
      next(); // Proceed to the next middleware or route handler
    } else {
      console.log("user i snot defined");
      // User is not authorized
      res.status(403).json({
        error: "Forbidden: You are not authorized to perform this action",
      });
    }
  };
};

const authorizeAdminOrSuperUser = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "ADMIN" || req.user.role === "SUPER_USER")
  ) {
    next(); // Proceed to the next middleware or route handler
  } else {
    // User is not authorized
    res.status(403).json({
      error: "Forbidden: You are not authorized to perform this action",
    });
  }
};

module.exports = {
  authorizeSuperUser: authorizeRole("SUPER_USER"),
  authorizeAdminUser: authorizeRole("ADMIN"),
  authorizeAdminOrSuperUser,
};
