const { validationResult } = require("express-validator");
const {
  isEmptyList,
  handleError,
  handleErrorWithFile,
} = require("./util/controller.util");
const User = require("../models/users/dbmodels/user.model");
const profilePhoto = require("../models/users/dbmodels/user.profilephoto.model");
const userProfilePhotoService = require("../services/user.profilephoto.service");
const log4js = require("log4js");
const logger = log4js.getLogger("userPhotoController");

module.exports.uploadphto = async function (req, res) {
  try {
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const user = req.user;
    const result = await userProfilePhotoService.uploadProfilePhoto(
      user,
      filePath
    );
    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
