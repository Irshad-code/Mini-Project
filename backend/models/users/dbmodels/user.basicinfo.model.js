var mongoose = require("mongoose");
var userBasicInfo = require("../../../schema/user.basicinfo.scema");
module.exports = mongoose.model(
  "UserBasicInfo",
  userBasicInfo,
  "userBasicInfo"
);
