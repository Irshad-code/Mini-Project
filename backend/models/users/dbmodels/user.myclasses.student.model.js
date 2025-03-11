var mongoose = require("mongoose");
var StudentSchema = require("../../../schema/user.myclasses.student.schema");
module.exports = mongoose.model(
  "studentModel",
  StudentSchema,
  "student"
);
