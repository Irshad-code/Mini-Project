const express = require("express");
const adminUserController = require("../../../controllers/admin/admin.user.controller");
const passport = require("../../../passport/jwtStrategy.passport");
const router = express.Router();
const {
  loginLimiter,
  commonLimiter,
} = require("../../../routes/users/middleware/ratelimit.middleware"); // Adjust the path as necessary
const fileUpload = require("../../../routes/users/middleware/userfileUpload.middleware");

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../../../passport/authorizationMiddleware");
const {
  SignupRequest,
} = require("../../../models/admin/users/User.SignupRequest");
const {
  UpdateRequest,
} = require("../../../models/admin/users/User.UpdateRequest");
const {
  validateAndTransformRequest,
  validateId,
} = require("../../routes.common.middleware/validation.middleware");

router.post(
  "/signup",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminOrSuperUser,
  validateAndTransformRequest(SignupRequest),
  adminUserController.signup
);
router.put(
  "/:id",
  validateId,
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminOrSuperUser,
  fileUpload.single("image"),
  validateAndTransformRequest(UpdateRequest),
  adminUserController.updateById
);
router.delete(
  "/:id",
  commonLimiter,
  validateId,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminOrSuperUser,
  adminUserController.deleteById
);
module.exports = router;
