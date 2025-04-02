const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassRecordSchema = new Schema(
  {
    series1Marks: { type: Number, required: true },
    series2Marks: { type: Number, required: true },
    attendanceDates: { type: [Date], default: [] }, // Stores a list of attendance dates
    internalMarks: { type: Number, required: true },
  },
  { _id: false } // Prevents automatic `_id` generation
);

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    branch: { type: String, required: true },
    semester: { type: String, required: true },
    classRecords: {
      type: Map, // Defines it as a key-value store (like a JavaScript object)
      of: ClassRecordSchema, // Uses the schema without `_id`
      default: {}, // Ensures the default value is an empty object
    },
  },

  { timestamps: true }
);

// Convert schema to JSON
StudentSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.studentId = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
  },
});

module.exports = StudentSchema;
