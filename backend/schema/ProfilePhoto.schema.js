const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const profilePhotoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userId is unique
      index: true, // Add an index for fast lookups
    },
    filePath: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
profilePhotoSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.profilePhotoId = ret._id;
    delete ret._id; // Removes _id from JSON output
    return ret;
  },
});

// Apply the unique validator plugin
profilePhotoSchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});

module.exports = profilePhotoSchema;
