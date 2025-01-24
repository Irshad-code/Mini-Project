const express = require("express");
const fileUpload = require("../middlewares/userfileUpload.middleware");
const router = express.Router();
const userphotoController = require("../controllers/user.profilephoto.controller");
const commonController = require("../controllers/common.controller");
const passport = require("../passport/jwtStrategy.passport");
const {
  loginLimiter,
  commonLimiter,
} = require("../middlewares/ratelimit.middleware"); // Adjust the path as necessary

const {
  authorizeAdminUser,
  authorizeSuperUser,
  authorizeAdminOrSuperUser,
} = require("../passport/authorizationMiddleware");

/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Route for resetting password

////////////////////////////////////////////////////////////
router.post(
  "/upload",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  fileUpload.single("file"),
  userphotoController.uploadphto
);
router.get(
  "/findbyuserid",
  commonLimiter,
  passport.authenticate("jwt", { session: false }), // Authenticate the request with Passport JWT
  commonController.findByUserId
);

module.exports = router;
