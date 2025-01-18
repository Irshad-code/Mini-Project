const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true, // Ensure departmentName     is unique
    },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
departmentSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.departmentId = ret._id;
    delete ret._id; // Removes _id from JSON output
    return ret;
  },
});

// Apply the unique validator plugin
departmentSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

module.exports = departmentSchema;
