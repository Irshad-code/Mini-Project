const express = require("express");
//const { check, body, validationResult } = require("express-validator");
const usersController = require("../../../controllers/user.controller");
const fileUpload = require("../middleware/userfileUpload.middleware");
const router = express.Router();
const passport = require("../../../passport/jwtStrategy.passport");
const {
  loginLimiter,
  commonLimiter,
} = require("../middleware/ratelimit.middleware"); // Adjust the path as necessary
const {
  SignupRequest,
} = require("../../../models/admin/users/User.SignupRequest");

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../../../passport/authorizationMiddleware");
const {
  LoginRequest,
} = require("../../../models/users/requests/User.LoginRequest");
const {
  UpdateRequest,
} = require("../../../models/users/requests/User.UpdateRequest");
const {
  ResendVerificationRequest,
} = require("../../../models/users/requests/User.ResendVerificationRequest"); // Yup request validation schema
const {
  ResetPasswordRequest,
} = require("../../../models/users/requests/User.ResetPasswordRequest");
const {
  ResetPasswordRequestWithEmail,
} = require("../../../models/users/requests/User.ResetPasswordWithEmailRequest");
const {
  validateAndTransformRequest,
  validateId,
} = require("../../routes.common.middleware/validation.middleware");
const {
  validateTokenParam,
} = require("../middleware/validatetoken.middleware");
const {
  validateAndTransformUrlParamRequest,
} = require("../../routes.common.middleware/paramValidationMiddleware");
const {
  ListRequest,
} = require("../../../models/users/requests/User.ListRequest");
const {
  SearchRequest,
} = require("../../../models/users/requests/User.Listwithsearch");
///////////////////////////////////////////////////////////
//routes starts here
////////////////////////////////////////////////////////////
//router for signup
router.post(
  "/signup",
  commonLimiter,
  validateAndTransformRequest(SignupRequest),
  usersController.signup
);

///////////////////////////////////////////////////////////
router.post(
  "/login",
  loginLimiter,
  validateAndTransformRequest(LoginRequest),
  usersController.login
);
/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Route for resetting password
router.post(
  "/reset-password",
  commonLimiter,
  validateAndTransformRequest(ResetPasswordRequest),
  usersController.resetPassword
);
//////////////////////////////////////////
router.post(
  "/reset-password-with-email",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  validateAndTransformRequest(ResetPasswordRequestWithEmail),
  usersController.resetPasswordWithEmail
);
/////////////////////////////////////////////////
router.get(
  "/list",
  validateAndTransformUrlParamRequest(ListRequest),
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminOrSuperUser,
  usersController.list
);

//////////////////////////////////////////////////////////////
router.get(
  "/verify/:token",
  commonLimiter,
  validateTokenParam,
  usersController.verifyEmail
);
////////////////////////////////////////////////////////////
// Route for forgot password
router.post(
  "/forgot-password",
  commonLimiter,
  validateAndTransformRequest(ResendVerificationRequest),
  usersController.forgotPassword
);

////////////////////////////////////////////////////////////
// Route to handle resending verification email
router.post(
  "/resend-verification",
  commonLimiter,
  validateAndTransformRequest(ResendVerificationRequest), // Validation middleware
  usersController.resendVerificationEmail // Controller method
);

router.put(
  "/:id",
  validateId,
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  fileUpload.single("image"),
  validateAndTransformRequest(UpdateRequest),
  usersController.updateById
);
////////////////////////////////////////////////////////////
module.exports = router;
