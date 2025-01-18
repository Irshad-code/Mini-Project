var mongoose = require("mongoose");
var departmentSchema = require("../../../../schema/department.schema");
module.exports = mongoose.model("Department", departmentSchema, "department");
