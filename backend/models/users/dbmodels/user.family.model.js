var mongoose = require("mongoose");
var userFamily = require("../../../schema/user.family.schma");
module.exports = mongoose.model("UserFamily", userFamily, "userFamily");
