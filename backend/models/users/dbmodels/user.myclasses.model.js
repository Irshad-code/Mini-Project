var mongoose = require("mongoose");
var classesSchema = require("../../../schema/user.myclasses.schema");
module.exports = mongoose.model("UserMyClassesModel", classesSchema,"userMyClasses");
