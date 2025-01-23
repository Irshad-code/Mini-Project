const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const encryption = require("mongoose-encryption");
// Log the encryption key to verify it's being loaded correctly
console.log("Encryption Key:", process.env.ENCRYPTION_KEY);
//let us ecript all the fields in one shot without user id
// Define the main userContactDetails schema
const userOfficialIds = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userId is unique
      index: true, // Add an index for fast lookups
    },
    PAN: { type: String, required: false },
    AadharCard: { type: String, required: false },
    PEN: { type: String, required: false },
    KTUId: { type: String, required: false },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);
// Apply the encryption plugin to the schema
// Apply the encryption plugin to the schema
userOfficialIds.plugin(encryption, {
  encryptedFields: ["PAN", "AadharCard", "PEN", "KTUId"], // Fields to encrypt
  secret: process.env.ENCRYPTION_KEY, // Secret key for encryption
});

// Set schema options for better JSON output
userOfficialIds.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.userOfficialId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    return ret;
  },
});

// Apply the uniqueValidator plugin to the userContactDetails schema
userOfficialIds.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});

module.exports = userOfficialIds;
