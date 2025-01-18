const mongoose = require("mongoose");

const usersModel = require("../models/users/dbmodels/user.model");
//db url

const uri = process.env.MONGODB_URI;
//make db connection
module.exports = mongoose
  .connect(uri, { autoIndex: true })
  .then((result) => {
    console.log("successful connection! established");
  })
  .catch((error) => console.log(error));
