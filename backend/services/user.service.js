const { query } = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/users/dbmodels/user.model");
const profilePhoto = require("../models/users/dbmodels/user.profilephoto.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const log4js = require("log4js");
const logger = log4js.getLogger("userServices");
// Find user by email
async function findUserByEmail(email) {
  return await userModel.findOne({ email });
}
// Find user by id
async function findUserById(userId) {
  return await userModel.findById(userId);
}
async function findUserByResetToken(hashedToken) {
  return await userModel.findOne({ passwordResetToken: hashedToken });
}
async function updateUserById(userId, updateData) {
  return userModel.findByIdAndUpdate(userId, updateData);
}

// 1. Function to get user by the verification token
async function getUserByVerificationToken(token) {
  return await userModel.findOne({ verificationToken: token });
}

// 2. Function to verify the user's email
async function verifyUserEmail(user) {
  user.emailVerified = true;
  return await user.save();
}

//5. Function to create User
async function createUser(userData) {
  // Create new user instance with the user data provided
  const newUser = new userModel(userData);

  // Save the user in the database
  return await newUser.save();
}
//////////////////////////////
// Update the user's verification token in the database
const updateUserVerificationToken = async (user, verificationToken) => {
  user.verificationToken = verificationToken;
  await user.save();
};
/////////////////////////
// Save hashed reset token and set expiration time
const saveResetToken = async (userId, hashedToken) => {
  const tokenExpiration = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour
  await userModel.findByIdAndUpdate(userId, {
    passwordResetToken: hashedToken,
    passwordResetExpires: tokenExpiration,
  });
};
///////////////////////////////////////////

async function list(user, page, limit, role) {
  try {
    const sortmethod = { updatedAt: -1 };
    const projectfieldsforList = "-password";
    // Initialize base query
    //let query = { status: "ACTIVE" };
    let query = {};
    // If a role is provided, add it to the query
    if (role) {
      query.role = role;
    }
    logger.debug("query :", query);
    const startIndex = (page - 1) * limit;

    const users = await userModel
      .find(query)
      .limit(limit)
      .skip(startIndex)
      .exec();

    const totalItems = await userModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      users: users,
      pagination: {
        totalItems: totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function search(user, page, limit, role, username, email) {
  try {
    const sortmethod = { updatedAt: -1 };
    const projectfieldsforList = "-password";
    // Initialize base query
    let query = { status: "ACTIVE" };
    // If a role is provided, add it to the query
    if (role) {
      query.role = role;
    }
    if (username) {
      logger.debug("username passed in the query:", username);
      query.username = { $regex: username, $options: "i" }; // Case-insensitive partial match
    }
    if (email) {
      query.email = { $regex: email, $options: "i" }; // Case-insensitive partial match
    }

    logger.debug("query :", query);
    const startIndex = (page - 1) * limit;
    if (query.role == "ALL_ADMIN") {
      query.role = { $in: ["ADMIN", "NODAL_OFFICER"] };
    }
    const users = await userModel
      .find(query)
      .limit(limit)
      .skip(startIndex)
      .exec();

    const totalItems = await userModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      users: users,
      pagination: {
        totalItems: totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
async function uploadProfilePhoto(userId, filePath) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    //if user exist i need to upsert the image to the profilephoto collection
    const profilePhoto = await profilePhoto.findOneAndUpdate(
      { userId: userId },
      { filePath: filePath },
      { upsert: true, new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  getUserByVerificationToken,
  verifyUserEmail,
  findUserByEmail,
  updateUserVerificationToken,
  createUser,
  saveResetToken,
  findUserByResetToken,
  ///below functions may need to change
  findUserById,
  list,
  search,
  updateUserById,
  uploadProfilePhoto,
};
