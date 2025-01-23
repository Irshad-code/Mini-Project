const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
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

const {
  OfficialidsRequest,
} = require("../models/users/requests/user.OfficialidsRequest");

///////////////////////////////////////////////////////////
//routes starts here
////////////////////////////////////////////////////////////
//router for signup
router.post(
  "/upsert",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminUser,
  validateId,
  validateAndTransformRequest(OfficialidsRequest),
  commonController.upsertByUserId
);
router.get(
  "/findbyuserid",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  authorizeAdminUser,
  validateId,
  commonController.findByUserId
);

////////////////////////////////////////////////////////////
module.exports = router;
