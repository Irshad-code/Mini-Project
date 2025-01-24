const { query } = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/users/dbmodels/user.model");
const profilePhoto = require("../models/users/dbmodels/user.profilephoto.model");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const log4js = require("log4js");
const logger = log4js.getLogger("userPhotoServices");

async function uploadProfilePhoto(userId, filePath) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    //if user exist i need to upsert the image to the profilephoto collection
    return await profilePhoto.findOneAndUpdate(
      { userId: userId },
      { filePath: filePath },
      { upsert: true, new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  uploadProfilePhoto,
};
