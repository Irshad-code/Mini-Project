var mongoose = require("mongoose");
var classesSchema = require("../../../schema/user.classes.schema");
module.exports = mongoose.model("UserClassesModel", classesSchema,"userClasses");
