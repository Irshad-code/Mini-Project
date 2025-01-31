const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
const { commonLimiter } = require("../middlewares/ratelimit.middleware");

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../passport/authorizationMiddleware");

const {
  validateAndTransformRequest,
  validateId,
} = require("../middlewares/validation.middleware");

// Route to create or update user classes information
// Requires: JWT authentication, Admin privileges
router.post(
  "/upsert",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  authorizeAdminUser,
  validateId,
  commonController.upsertByUserId
);

// Route to fetch user classes by user ID
router.get(
  "/findbyuserid",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  authorizeAdminUser,
  validateId,
  commonController.findByUserId
);

// Route to get all classes (with pagination)
router.get(
  "/list",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  authorizeAdminUser,
  commonController.list
);

// Route to delete classes by ID
router.delete(
  "/:id",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  authorizeAdminUser,
  validateId,
  commonController.deleteById
);

module.exports = router;