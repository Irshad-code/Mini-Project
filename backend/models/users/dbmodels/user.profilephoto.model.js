var mongoose = require("mongoose");
var profilePhotoSchema = require("../../../schema/ProfilePhoto.schema");
module.exports = mongoose.model(
  "UserProfilePhoto",
  profilePhotoSchema,
  "userProfilePhoto"
);
