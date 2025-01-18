const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const crypto = require("crypto");
const { sendRegistrationEmail } = require("../services/email/registrationMail");
const {
  sendForgotPasswordEmail,
} = require("../services/email/forgotPasswordMail");
const {
  isEmptyList,
  handleError,
  handleErrorWithFile,
} = require("./util/controller.util");
const User = require("../models/users/dbmodels/user.model");
const userService = require("../services/user.service");
const log4js = require("log4js");
const logger = log4js.getLogger("userController");
const { generateToken, hashToken } = require("../services/email/token.utils");
const common = require("mocha/lib/interfaces/common");
// Controller function to handle forgot password
///////////////////////////////
module.exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Fetch user by email from the service
    const existingUser = await userService.findUserByEmail(email);

    if (!existingUser) {
      return handleError(res, 401, "Invalid user or password.");
    }
    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return handleError(res, 401, "Invalid user or password.");
    }

    // Check if the email is verified
    if (!existingUser.emailVerified) {
      return handleError(res, 424, "Email not verified.");
    }

    // Check if password reset is required
    // Check if password reset is required
    if (existingUser.passwordResetRequired) {
      // Generate token
      const userResponse = {
        resetToken: existingUser.passwordResetToken,
        message: "Password reset required.",
      };
      return res.status(428).json(userResponse);
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role }, // Payload
      secretKey, // Secret key
      { expiresIn: "1d" } // Token expires in 1 day
    );

    const userResponse = existingUser.toJSON();

    userResponse.token = token;

    // Successful login response
    res.status(200).json(userResponse);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Find user by email
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Generate reset token and hash it
    const resetToken = generateToken();
    const hashedToken = hashToken(resetToken);

    // Save hashed token and set expiration date for password reset (e.g., 1 hour)

    userService.saveResetToken(user._id, hashedToken);

    // Send reset password email with token
    const resetUrl = `${process.env.PRODUCTION_URL}/reset-email-response?token=${resetToken}`;
    // const resetUrl = `localhost:3001/reset-email-response?token=${resetToken}`;
    logger.debug(`Password reset email is senting ${user.email}`);
    sendForgotPasswordEmail(user.email, user.username, resetUrl);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    logger.error("Error in forgotPassword controller:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};
module.exports.resetPassword = async function (req, res) {
  try {
    const { token, password } = req.body;

    // Hash the token
    const hashedToken = hashToken(token);

    // Find user with matching reset token and check if token is expired
    const user = await userService.findUserByResetToken(hashedToken);
    if (!user || user.passwordResetExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Hash new password and update user's password

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.passwordResetRequired = false;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // Ensure the user is saved properly with `await`

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    logger.error("Error in resetPassword: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
module.exports.resetPasswordWithEmail = async function (req, res) {
  logger.debug("inside reset password with email");
  const { email, password } = req.body;
  if (req.user.email != email) {
    return handleError(res, 401, "Invalid user");
  }
  const user = await userService.findUserByEmail(email);
  logger.debug(user);

  if (!user || user.status !== "ACTIVE") {
    return handleError(res, 401, "Invalid user");
  }
  if (!(user._id === req.user._id)) {
    return handleError(res, 401, "Invalid user");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  logger.debug("hashedPassword ;", hashedPassword);
  user.password = hashedPassword;
  user.passwordResetRequired = false;
  user.save();
  res.status(201).json({
    message: "Please login to the system",
  });
};

module.exports.updateById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, phoneNumber } = req.body;
    const image = req.file ? req.file.path : null; // Get image path if uploaded
    const user = await userService.findUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.code = 404; // Set error code to 404 Not Found
      throw error;
    }
    // If there's a new image, delete the old one (if exists)
    if (image) {
      user.image = image; // Assign new image path
    }

    // Update the username
    if (username) {
      user.username = username;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    // Save the updated user
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      secretKey, // Secret key
      { expiresIn: "1d" } // Token expires in 1 day
    );
    const existingUser = await userService.findUserById(user._id);

    const userResponse = existingUser.toJSON();
    userResponse.token = token;

    res.status(200).json(userResponse);
  } catch (error) {
    return handleError(res, 500, "Internal server error ", error);
  }
};

/////////////////////////////////////////
module.exports.signup = async function (req, res) {
  try {
    logger.debug("request body", req.body);
    const { email, password, department } = req.body;
    logger.debug("email found", email);
    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    logger.debug("existingUser: ", existingUser);
    if (existingUser) {
      return res.status(422).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a verification token if email verification is enabled
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Prepare user data for saving
    const userData = {
      ...req.body, // Contains all validated fields like username, email, role, etc.
      password: hashedPassword,
      emailVerified: true,
      verificationToken,
    };
    logger.debug("userData", userData);
    // Save the user in the database
    const newUser = await userService.createUser(userData);
    // Send verification email if required
    if (process.env.EMAIL_ENABLED === "true") {
      const verificationLink = `${process.env.PRODUCTION_URL}/verification?token=${userData.verificationToken}`;
      // const verificationLink = `localhost:3001/verification?token=${userData.verificationToken}`;
      sendRegistrationEmail(
        userData.email,
        userData.username,
        verificationLink
      );
      logger.debug("verificationLink :", verificationLink);
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
/////////////////////////////

///////////////////////////////
module.exports.verifyEmail = async function (req, res) {
  try {
    const { token } = req.params;

    // 1. Check if the token is valid and associated with a user
    const user = await userService.getUserByVerificationToken(token);

    // 2. Handle case where no user is found for the token
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token.",
      });
    }

    // 3. Mark the user's email as verified
    await userService.verifyUserEmail(user);

    // 4. Return a success response in JSON
    logger.debug("Email verification successful for user:", user.email);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    // Log the error for debugging
    logger.error("Error during email verification:", error);

    // Return a generic error message
    return res.status(500).json({
      success: false,
      message:
        "An error occurred during email verification. Please try again later.",
    });
  }
};

///////////////////////////
module.exports.resendVerificationEmail = async function (req, res) {
  const { email } = req.body; // Extract the email from the request body

  try {
    // Find user by email (existing service method)
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return handleError(res, 401, "User does not exist ");
    }
    // Ensure the user's email is not already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate a new or retrieve the existing verification token
    const verificationToken =
      user.verificationToken || crypto.randomBytes(32).toString("hex");

    // Update the user's verification token (existing method for user updates)
    userService.updateUserVerificationToken(user, verificationToken);

    // Generate the verification link using host
    const verificationLink = `${process.env.PRODUCTION_URL}/verification?token=${verificationToken}`;
    // const verificationLink = `localhost:3001/verification?token=${verificationToken}`;
    logger.debug(verificationLink);
    // Send the verification email
    sendRegistrationEmail(user.email, user.username, verificationLink);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    // Handle errors and respond with appropriate status and message
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to resend verification email",
    });
  }
};
////////////////////////////////////

////////////////////////////////////
module.exports.list = async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role; // Optional role query parameter

    logger.debug(
      `Fetching user list for page ${page} with limit ${limit} and role ${role}`
    );

    const result = await userService.list(req.user, page, limit, role); // Pass role to the service

    if (isEmptyList(result)) {
      return handleError(res, 404, "Result not found");
    }

    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};

module.exports.search = async function (req, res) {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role; // Optional role query parameter
    const username = req.query.username;
    const email = req.query.email;

    logger.debug(
      `Searching users for page ${page}, limit ${limit}, role ${role}`
    );

    // Call the search service function with the user from the request, page, limit, and role
    const result = await userService.search(
      req.user,
      page,
      limit,
      role,
      username,
      email
    );

    if (isEmptyList(result.users)) {
      return handleError(res, 404, "No users found matching the criteria");
    }

    return res.json(result);
  } catch (error) {
    logger.error("Error occurred while searching users:", error.message);
    return handleError(res, 500, "Internal server error", error);
  }
};
