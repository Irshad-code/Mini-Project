const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const studentModel = require("../models/users/dbmodels/user.myclasses.student.model");
const UserMyClassesModel = require("../models/users/dbmodels/user.myclasses.model");
const app = express();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Serve static files (frontend)
app.use(express.static("public"));

// Handle file upload
async function handleUploadExcel(req, res) {
  const classId = req.params.id; // Get 'id' from URL
  console.log("Received ID:", classId);

  upload.single("excelFile")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Delete file after processing (optional)
      fs.unlinkSync(filePath);

      // Extract rollNumbers & emails from Excel data
      const rollNumbers = jsonData.map((student) => student["Roll Number"]);
      const emails = jsonData.map((student) => student["Email"]);
      console.log("Roll Numbers:", rollNumbers);
      console.log("Emails:", emails);
      // Step 1: Check existing students in DB with same rollNumber or email
      const existingStudents = await studentModel.find({
        $or: [{ rollNumber: { $in: rollNumbers } }, { email: { $in: emails } }],
      });

      // Step 2: Filter out duplicate students
      const existingRollNumbers = new Set(existingStudents.map((s) => s.rollNumber));

      const existingEmails = new Set(existingStudents.map((s) => s.email));

      const uniqueStudents = jsonData.filter(
        (student) =>
          !existingRollNumbers.has(student["Roll Number"]) &&
          !existingEmails.has(student["Email"])
      );

      if (uniqueStudents.length === 0) {
        return res
          .status(400)
          .json({ error: "No unique students found to insert." });
      }

      const studentRecords = uniqueStudents.map((student) => ({
        classList: [classId],
        name: student["Name"],
        rollNumber: student["Roll Number"],
        email: student["Email"],

        phone: student["Phone"],
        semester: student["Semester"],
        branch: student["Branch"],
      }));
      
      const insertedStudents = await studentModel.insertMany(studentRecords);
      const studentIds = insertedStudents.map((s) => s._id);
      console.log("Student IDs to be added to class:", studentIds);

      // Update the class to store student references
      await UserMyClassesModel.findByIdAndUpdate(
        classId,
        { $push: { studentList: { $each: studentIds } } },
        { new: true }
      );

      return res.status(201).json({
        message: `Excel uploaded successfully for class id= ${classId}`,
        record: insertedStudents,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error processing file.", details: error.message });
    }
  });
}

async function deleteStudentIdFromAllClasses(req,res){
     const studentId = req.params.id;
     try{
       // Step 1: Find all classes that contain the studentId
       const classes = await UserMyClassesModel.find({
         studentList: studentId,
       });

       if (!classes.length) {
         return res
           .status(404)
           .json({ message: "Student not found in any class" });
       }

       // Step 2: Remove studentId from each class's studentList
       await UserMyClassesModel.updateMany(
         { studentList: studentId },
         { $pull: { studentList: studentId } }
       );

      // actually the step 3 can be replaced by the commonController function 
      // Step 3: Delete the student from the Student collection
       await studentModel.findByIdAndDelete(studentId);

       return res.status(200).json({
         message: `Student ID ${studentId} removed from all classes.`,
         nameOfStudent:studentModel.findById(studentId).name,
       });
     }catch(error){
          return res.status(500).json({error: "Error deleting student id from all classes"})
     }
}

async function insertStudentIdToCorrespondingClass(req,res){
  // Step 1: Create the new student jsonObject
  const {
    name,
  rollNumber,
  semester,
  branch,
  email,
  phone,
  classId,
  }=req.body;



  const newStudent = new studentModel({
    name,
    rollNumber,
    semester,
    branch,
    email,
    phone,
  });

  try {
    // Save student to database
    const savedStudent = await newStudent.save();

    const studentId = savedStudent._id;

    savedStudent.classList.push(classId);
    await savedStudent.save(); // Explicitly save the updated student

    // Step 2: Check if the class exists
    const existingClass = await UserMyClassesModel.findById(classId);
    if (!existingClass) {
      return res.status(404).json({
        message: `Class : ${classId}  not found`,
        error: error.message,
      });
    }

    // Step 3: Add the studentId to the class's studentList
    existingClass.studentList.push(studentId);
    await existingClass.save(); //explicitly save the class

    return res.status(201).json({
      message: `Student : ${savedStudent.name} inserted successfully into the ${existingClass.subject} class.`,
      student_Id: studentId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error inserting student id to corresponding class",
              error: error.message,
       });
     
  }
}

async function deleteClassIdFromAllTheCorrespondingStudents(req, res) {
  try{
    const classId = req.params.id;
    const { studentsList } = await UserMyClassesModel.findById(classId);
    if (!studentsList.length) {
      return res
        .status(404)
        .json({ message: "No students found in this class" });
    }

    // Step 2: Update all students to remove the class reference
    await Promise.all(
      studentsList.map(async (studentId) => {
        await studentModel.findByIdAndUpdate(
          studentId,
          { 
            $unset: { classId: "" },
          });
      })
    );

    // Step 3: Respond with success
    return res.status(200).json({
      message: `Class ID ${classId} removed from all corresponding students.`,
      updatedStudents: studentsList,
    });
  }catch(error){
    
  }
}
// ✅ Ensure the function is exported correctly
module.exports = {
  handleUploadExcel,
  deleteStudentIdFromAllClasses,
  insertStudentIdToCorrespondingClass,
  deleteClassIdFromAllTheCorrespondingStudents,
};

  