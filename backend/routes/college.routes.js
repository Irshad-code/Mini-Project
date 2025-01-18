const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
const {
  CreateRequest,
} = require("../models/admin/colleges/requests/college.CreateRequest");
const { commonLimiter } = require("../middlewares/ratelimit.middleware"); // Adjust the path as necessary

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../passport/authorizationMiddleware");

const {
  validateAndTransformRequest,
  validateId,
} = require("../middlewares/validation.middleware");

///////////////////////////////////////////////////////////
//routes starts here
////////////////////////////////////////////////////////////
//router for signup
router.post(
  "/create",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminUser,
  validateAndTransformRequest(CreateRequest),

  commonController.create
);
router.get("/completelist", commonLimiter, commonController.completeList);
////////////////////////////////////////////////////////////
module.exports = router;
