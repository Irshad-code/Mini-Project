const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const MyClassesSchema = new Schema(
  {
    subject: { type: String, required: true },
    code: { type: String, required: true }, //may set Unique
    semester: { type: String, required: true },
    type: { type: String, required: true },
    branch: {
      type: String,
      validate: {
        validator: function (value) {
          // If type is 'ordinary', then branch must not be empty
          if (this.type === "ordinary") {
            return value && value.trim().length > 0;
          }
          // Otherwise it's okay even if branch is empty
          return true;
        },
        message: "Branch is required when type is 'ordinary'",
      },
    },
    schedule: { type: String, required: true },
    courseFilesLink: { type: String }, // File path or URL
    studentList: [{ type: mongoose.Schema.Types.ObjectId, default: [] }], // Store student IDs
    currentClass: { type: Boolean, required: true },
    attendanceDateList: [{ type: String, default: [] }],
    //syllabus: { type: String, required: true }, // File path or URL
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