var mongoose = require("mongoose");
var userBasicInfo = require("../../../schema/user.schema");
module.exports = mongoose.model(
  "UserBasicInfo",
  userBasicInfo,
  "userBasicInfo"
);
