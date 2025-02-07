const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const MyClassesSchema = new Schema(
  {
    subject: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    semester: { type: String, required: true },
    branch: { type: String, required: true },
    students: { type: Number, required: true, min: 1 },
    schedule: { type: String, required: true },
    syllabus: { type: String, required: true }, // File path or URL
    courseOutcome: { type: String, required: true }, // File path or URL
  },
  { timestamps: true }
);

// Set schema options for better JSON output
MyClassesSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false, // Removes __v from JSON output
  transform: (doc, ret) => {
    ret.userclassesId = ret._id;
    delete ret._id; // Removes _id from JSON output
    delete ret.id;
    return ret;
  },
});

// Apply the uniqueValidator plugin to the userContactDetails schema
MyClassesSchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique.",
});

module.exports = MyClassesSchema;