const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId, ref: "MyClass",required: true,
    }, // Reference to thier class
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

module.exports = mongoose.model("Student", StudentSchema);
