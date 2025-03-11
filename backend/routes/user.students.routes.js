const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const { commonLimiter } = require("../middlewares/ratelimit.middleware");
const { authorizeAdminUser } = require("../passport/authorizationMiddleware");
const { validateAndTransformRequest, validateId } = require("../middlewares/validation.middleware");
const myClassesController = require("../controllers/user.myclasses.controller");
const commonController = require("../controllers/common.controller");
const { MyClassesStudentRequest } = require("../models/users/requests/user.MyClassesStudentRequest");

router.post(
  "/create",//create one student for a class
  commonLimiter,
//   passport.authenticate("jwt", { session: false }),
//   authorizeAdminUser,
  validateAndTransformRequest(MyClassesStudentRequest),
  //commonController.create,
  myClassesController.insertStudentIdToCorrespondingClass //created student in Db and insert the student id to the corresponding class studentList[]
);

router.get(
  "/",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  commonController.completeList
);

router.put(
  "/update/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }), 
  // authorizeAdminUser,
  validateAndTransformRequest(MyClassesStudentRequest),
  commonController.updateById,
);

router.delete(
  "/delete/:id",// id of the student
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  myClassesController.deleteStudentIdFromAllClasses, // deleted that student Id from all the classes which he enrolled
  //commonController.deleteById, //delete the student from Db( actually it is done on the previous step for the time being.)
);


module.exports = router;