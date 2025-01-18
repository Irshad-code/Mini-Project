var mongoose = require("mongoose");
var collegeSchema = require("../../../../schema/colleges.schema");
module.exports = mongoose.model("College", collegeSchema, "college");
