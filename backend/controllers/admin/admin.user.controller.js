const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const crypto = require("crypto");
const userService = require("../../services/user.service");
const {
  sendadminRegistrationEmail,
} = require("../../services/email/adminRegistrationMail");
const { handleErrorWithFile } = require("../util/controller.util");
const User = require("../../models/users/dbmodels/user.model");
const log4js = require("log4js");
const logger = log4js.getLogger("adminUserController");
// Controller function to handle forgot password
/////////////////////////////////////////
///signup
//////////////////////////////////
module.exports.signup = async function (req, res) {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(422).json({ message: "User already exists." });
    }

    const nonHashedPassword = password;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a verification token if email verification is enabled
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour
    // Prepare user data for saving
    const userData = {
      ...req.body, // Contains all validated fields like username, email, role, etc.
      password: hashedPassword,
      emailVerified: process.env.EMAIL_ENABLED !== "true",
      verificationToken,
      passwordResetRequired: true,
      passwordResetToken: resetToken,
      passwordResetExpires: tokenExpiration,
    };
    logger.debug("userData", userData);
    // Save the user in the database
    const newUser = await userService.createUser(userData);

    // Send verification email if required
    if (process.env.EMAIL_ENABLED === "true") {
      const verificationLink = `${process.env.PRODUCTION_URL}/verification?token=${newUser.verificationToken}`;
      // const verificationLink = `localhost:3001/verification?token=${newUser.verificationToken}`;
      sendadminRegistrationEmail(
        newUser.email,
        newUser.username,
        nonHashedPassword,
        verificationLink
      );

      return res.status(201).json({
        message:
          "User registered. Please check your email to confirm your registration.",
      });
    }

    // If email verification is disabled
    return res.status(201).json({
      message: "User registered. Please login to the system.",
    });
  } catch (error) {
    return handleErrorWithFile(req, res, 500, "Internal server error", error);
  }
};
module.exports.deleteById = async function (req, res) {
  const userId = req.params.id;
  const user = await userService.findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404; // Set error code to 404 Not Found
    throw error;
  }
  user.status = "SUSPENDED";
  const deletedAccount = await user.save();
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
module.exports.updateById = async (req, res) => {
  try {
    logger.debug("inside update By ID");
    const { id: userId } = req.params;
    const { username, email, role, status, phoneNumber } = req.body;
    const image = req.file?.path;

    // Build update object dynamically
    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(role && { role }),
      ...(status && { status }),
      ...(phoneNumber && { phoneNumber }),
      ...(image && { image }),
    };

    // Use findByIdAndUpdate for one-step update
    const user = await userService.findUserById(userId);
    if (!user) {
      return handleError(res, 401, "Invalid user or password.");
    }
    await userService.updateUserById(userId, updateData);
    res.status(200).json({ message: "Updated user profile" });
  } catch (error) {
    handleErrorWithFile(req, res, 500, "Internal server error", error);
  }
};
