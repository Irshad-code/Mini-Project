var mongoose = require("mongoose");
var userOfficialIds = require("../../../schema/user.OfficialIds.schema");
module.exports = mongoose.model(
  "UserOfficialIds",
  userOfficialIds,
  "userOfficialIds"
);
