var mongoose = require("mongoose");
var userContactDetails = require("../../../schema/user.contactdetails.schma");
module.exports = mongoose.model(
  "UserContactDetails",
  userContactDetails,
  "userContactDetails"
);
