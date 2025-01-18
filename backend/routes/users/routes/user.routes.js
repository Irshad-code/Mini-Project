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
} = require("../../../models/users/requests/User.SignupRequest");

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../../../passport/authorizationMiddleware");
const {
  LoginRequest,
} = require("../../../models/users/requests/User.LoginRequest");

const {
  validateAndTransformRequest,
  validateId,
} = require("../../../middlewares/validation.middleware");

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

////////////////////////////////////////////////////////////
module.exports = router;
