const { query } = require("express");
const mongoose = require("mongoose");
const userBasicInfoModel = require("../models/users/dbmodels/user.basicinfo.model");
const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger("userBasicInfoServices");
// Find user by id
async function findUserById(userId) {
  return await userBasicInfoModel.findOne({
    userId: mongoose.Types.ObjectId(userId),
  });
}

module.exports = {
  findUserById,
};
