const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Define the main userContactDetails schema
const userResponsibilitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userId is unique
      index: true, // Add an index for fast lookups
    },
    responsibilities: [
      {
        title: { type: String, required: true }, // Title of the responsibility
        description: { type: String, required: true }, // Description of the responsibility
      },
    ],
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
userResponsibilitySchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.responsibilityId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    return ret;
  },
});

// Apply the uniqueValidator plugin to the userContactDetails schema
userResponsibilitySchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});
module.exports = userResponsibilitySchema;
