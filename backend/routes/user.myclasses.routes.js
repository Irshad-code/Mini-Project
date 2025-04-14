const express = require("express");
const router = express.Router();
const passport = require("../passport/jwtStrategy.passport");
const commonController = require("../controllers/common.controller");
const { commonLimiter } = require("../middlewares/ratelimit.middleware");
const { authorizeAdminUser } = require("../passport/authorizationMiddleware");
const { validateAndTransformRequest, validateId } = require("../middlewares/validation.middleware");
const { MyClassRequest } = require("../models/users/requests/user.MyClasssesRequest");
const myClassesController = require("../controllers/user.myclasses.controller");
const { MyClassesStudentRequest } = require("../models/users/requests/user.MyClassesStudentRequest");

router.post(
  "/create", 
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  //validateAndTransformRequest(MyClassRequest),
  commonController.create
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
  //validateAndTransformRequest(MyClassRequest),
  commonController.updateById
);

router.delete(
  "/delete/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  myClassesController.deleteClassIdFromAllTheCorrespondingStudents,
  commonController.deleteById,//delete the classObject
  
); 

router.post(
  "/archieveorunarchieveclass/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  //validateAndTransformRequest(MyClassesStudentRequest),
  myClassesController.handleArchiveOrUnArchiveClass
);

 //excel upload student 
router.post(
  "/excelupload/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  //validateAndTransformRequest(MyClassesStudentRequest),
  myClassesController.handleUploadExcel
);

 //manual upload student 
router.post(
  "/manualupload/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  //validateAndTransformRequest(MyClassesStudentRequest),
  myClassesController.handleUploadManual
);

router.get(
  "/:id",//  /students/:id
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  myClassesController.completeListOfAllStudentsFromClass
);

router.put(
  "/students/update/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  myClassesController.updateStudentInClass
);

router.post(
  "/students/delete/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  myClassesController.deleteStudentIdFromClass
);

router.post(
  "/students/multi_delete/:id",
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  myClassesController.deleteMultipleStudentIdsFromClass
);

router.put(
  "/attendance/update/:id", // id of the class
  commonLimiter,
  // passport.authenticate("jwt", { session: false }),
  // authorizeAdminUser,
  validateId,
  //validateAndTransformRequest(MyClassesAttendanceRequest),//to create this request
  myClassesController.handleAttendanceOFStudents
);

module.exports = router; 