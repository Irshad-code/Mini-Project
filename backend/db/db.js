const mongoose = require("mongoose");

const usersModel = require("../models/users/dbmodels/user.model");
const userBasicInfo = require("../models/users/dbmodels/user.basicinfo.model");
const userContactDetails = require("../schema/user.contactdetails.schma");
const userOfficialIds = require("../models/users/dbmodels/user.OfficialIds.model");

//db url

const uri = process.env.MONGODB_URI;
//make db connection
module.exports = mongoose
  .connect(uri, { autoIndex: true })
  .then((result) => {
    console.log("successful connection with Mongoose! DataBase established");
  })
  .catch((error) => console.log(error));
