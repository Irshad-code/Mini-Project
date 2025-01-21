const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// Define the Address subdocument schema
const addressSchema = new Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String }, // Optional second line for address
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
});

// Define the main userContactDetails schema
const userContactDetails = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userId is unique
      index: true, // Add an index for fast lookups
    },
    contactEmail: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: addressSchema, required: true }, // Embed the Address subdocument
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
userContactDetails.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.userContactDetailsId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    return ret;
  },
});

// Apply the uniqueValidator plugin to the userContactDetails schema
userContactDetails.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});

module.exports = userContactDetails;
