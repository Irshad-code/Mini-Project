var mongoose = require("mongoose");
var userResponsibility = require("../../../schema/user.responsibility.schma");
module.exports = mongoose.model(
  "UserResponsibility",
  userResponsibility,
  "userResponsibility"
);
