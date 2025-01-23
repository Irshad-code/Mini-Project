const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Define the main userContactDetails schema
const familySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userId is unique
      index: true, // Add an index for fast lookups
    },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    spouseName: { type: String, required: false },
    marritalStatus: { type: String, required: false },
    numberOfChildren: { type: Number, required: false },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
familySchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.userfamilyId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    return ret;
  },
});

// Apply the uniqueValidator plugin to the userContactDetails schema
familySchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});

module.exports = familySchema;
