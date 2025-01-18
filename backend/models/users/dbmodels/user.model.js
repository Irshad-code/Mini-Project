var mongoose = require("mongoose");
var userSchema = require("../../../schema/user.schema");
module.exports = mongoose.model("User", userSchema, "user");
