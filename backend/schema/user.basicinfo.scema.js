const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userBasicInfo = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensure userid is unique
      index: true, // Add an index for fast lookups
    },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    college: { type: Schema.Types.ObjectId, ref: "College", required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: { type: String, required: true },
    highestQualification: { type: String, required: true },
    areaOfSpecialization: { type: String, required: true },
    isKtuPhdGuide: { type: Boolean, required: true },
    publicationCount: { type: Number, required: true },
    projectCount: { type: Number, required: true },
    religion: { type: String, required: true },
    caste: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    totalTeachingExperience: { type: Number, required: true },
    totalIndustryExperience: { type: Number, required: true },
    briefDescription: { type: String, required: true },
    websiteUrl: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt fields
  }
);

// Set schema options for better JSON output
userBasicInfo.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.basicInfoId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    delete ret.password; // Removes password from JSON output for security reasons
    return ret;
  },
});

// Apply the uniqueValidator plugin to userBasicInfo schema
userBasicInfo.plugin(uniqueValidator, { message: "{PATH} must be unique." });

module.exports = userBasicInfo;
