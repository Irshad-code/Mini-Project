const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
const { commonLimiter } = require("../middlewares/ratelimit.middleware");
const { authorizeAdminUser } = require("../passport/authorizationMiddleware");
const { validateAndTransformRequest, validateId } = require("../middlewares/validation.middleware");
const { MyClassRequest } = require("../models/users/requests/user.MyClasssesRequest");

router.post(
  "/create", 
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateAndTransformRequest(MyClassRequest),
  commonController.create
);
 
router.get(
  "/",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  //validateAndTransformRequest(MyClassRequest),
  commonController.completeList
);

router.put(
  "/update/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }), 
  // authorizeAdminUser,
  validateAndTransformRequest(MyClassRequest),
  commonController.updateById
);

router.delete(
  "/delete/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  commonController.deleteById
); 
 
module.exports = router;