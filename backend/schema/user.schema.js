const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique (this also creates an index)
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Set a minimum length for passwords
    },
    role: {
      type: String,
      default: "REGULAR_USER", // Default role set as REGULAR_USER
      enum: ["SUPER_USER", "ADMIN_USER", "REGULAR_USER"], // Allowed roles
      index: true, // Index on role for faster querying
    },
    emailVerified: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
      index: true, // Index on verificationToken for faster lookups
    },
    passwordResetToken: {
      type: String,
      sparse: true, // Sparse index on passwordResetToken to only index non-null values
    },
    passwordResetExpires: {
      type: Date,
    },
    image: {
      type: String,
      default: null, // Default to null if no image is provided
    },
    passwordResetRequired: {
      type: Boolean,
      default: false, // This field is required for admin-created users
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
userSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.userId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    delete ret.password; // Removes password from JSON output for security reasons
    return ret;
  },
});

// Apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

module.exports = userSchema;
