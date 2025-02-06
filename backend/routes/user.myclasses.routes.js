const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
const { commonLimiter } = require("../middlewares/ratelimit.middleware");
const { authorizeAdminUser } = require("../passport/authorizationMiddleware");
const { validateAndTransformRequest } = require("../middlewares/validation.middleware");
const { CreateMyClassRequest } = require("../models/users/requests/user.MyClasssesRequest");

router.post(
  "/create",
  commonLimiter,
  passport.authenticate("jwt", { session: false }),
  authorizeAdminUser,
  validateAndTransformRequest(CreateMyClassRequest),
  commonController.create
);
 
module.exports = router;