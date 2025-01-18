const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const collegeSchema = new Schema(
  {
    collegeName: {
      type: String,
      required: true,
      unique: true, // Ensure collegeName is unique
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
collegeSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.collegeId = ret._id;
    delete ret._id; // Removes _id from JSON output
    return ret;
  },
});

// Apply the unique validator plugin
collegeSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

module.exports = collegeSchema;
