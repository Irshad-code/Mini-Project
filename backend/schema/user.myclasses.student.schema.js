const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    branch: { type: String, required: true },
    semester: { type: String, required: true },
    classList: [
      { type: mongoose.Schema.Types.ObjectId, 
        ref: "MyClass", 
        default: [] 
      },
    ], // Reference to thier class and Store class IDs
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
