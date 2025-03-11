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
      // Step 1: Check existing students in Db with same rollNumber or email
      const existingStudents = await studentModel.find({
        $or: [{ rollNumber: { $in: rollNumbers } }, { email: { $in: emails } }],
      });

      // Step 2: Filter out from duplicate students
      const existingRollNumbers = new Set(existingStudents.map((s) => s.rollNumber));

      const existingEmails = new Set(existingStudents.map((s) => s.email));

      const existingStudentIdList = new Set(existingStudents.map((s) => s._id));

      const uniqueStudents = jsonData.filter(
        (student) =>
          !existingRollNumbers.has(student["Roll Number"]) &&
          !existingEmails.has(student["Email"])
      );

      if (uniqueStudents.length === 0) {
        // Step 3: Add the studentId to the existing class's studentList
        const existingClass = await UserMyClassesModel.findById(classId);
        // Add existing student IDs to the class's studentList
        existingClass.studentList = [
          ...new Set([
            ...existingClass.studentList,
            ...Array.from(existingStudentIdList),
          ]),
        ];

        await existingClass.save(); // Explicitly save the class

        // Add the classId to each student's classList (ensuring no duplicates)
        await studentModel.updateMany(
          { _id: { $in: Array.from(existingStudentIdList) } }, // Match all existing students
          { $addToSet: { classList: classId } } // Add classId to the classList of all corresponding students without duplicates
        );

        return res.status(203).json({
          message:
            "No unique students found, and inserted existing students Id to class from Excel",
        });
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

async function deleteStudentIdFromAllClasses(req,res,next){
     const studentId = req.params.id;
     try{
       // Step 1: Find all classes that contain the studentId
       const classes = await UserMyClassesModel.find({
         studentList: studentId,
       });

       if (!classes.length) {
         return next(); //Student not found in any class , goto next function
       }

       // Step 2: Remove the studentId from each class's studentList
       await UserMyClassesModel.updateMany(
         { studentList: studentId },
         { $pull: { studentList: studentId } }
       );

       console.log(`Student ID ${studentId} removed from all classes.
       nameOfStudent: ${studentModel.findById(studentId).name}`);

       return next(); //goto next function and Delete the student Object from the Db

     }catch(error){
          return res.status(500).json({error: "Error deleting student id from all classes"})
     }
}

async function insertStudentIdToCorrespondingClass(req,res){
  const { name,
          rollNumber, 
          semester, 
          branch, 
          email, 
          phone, 
          classId
         } = req.body;

  // Step 1: Create the new student jsonObject
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
    const studentSavedWithClassIdPush = false;
    const savedStudent = await newStudent.save();//can be done by commonController.create()

    savedStudent.classList.push(classId);
    await savedStudent.save(); // Explicitly save the updated student to Db
    
    studentSavedWithClassIdPush = true;

    // Step 2: Check if the class exists
    const existingClass = await UserMyClassesModel.findById(classId);
    if (!existingClass) {
      return res.status(404).json({
        message: `Class : ${classId}  not found`,
        error: error.message,
      });
    }

    const studentId = savedStudent._id;
    // Step 3: Add the studentId to the class's studentList
    existingClass.studentList.push(studentId);
    await existingClass.save(); //explicitly save the class

    return res.status(201).json({
      message: `Student : ${savedStudent.name} inserted successfully into the ${existingClass.subject} class.`,
      student_Id: studentId,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Error inserting student id to corresponding class and studentSavedWithClassIdPush = " +
        studentSavedWithClassIdPush,
      error: error.message,
    });
  }
}

async function deleteClassIdFromAllTheCorrespondingStudents(req, res, next) {
  try{
    const classId = req.params.id;
    const { studentList } = await UserMyClassesModel.findById(classId);

    if (!studentList.length) {
      // If no students are in the class, skip student update and proceed to class deletion
      return next();
    }

     // Step 2: Remove classId from all corresponding students in a single query
    await studentModel.updateMany(
      { _id: { $in: studentList } }, // Match all students in the studentList
      { $pull: { classList: classId } } // Remove the classId from their classList
    );
   //Move to the next middleware (which is commonController.deleteById)
    return next();

  }catch(error){
    return res
      .status(500)
      .json({
        message: "Error deleting classId from all it's students",
        error: error.message,
      });
  }
}
// ✅ Ensure the function is exported correctly
module.exports = {
  handleUploadExcel,
  deleteStudentIdFromAllClasses,
  insertStudentIdToCorrespondingClass,
  deleteClassIdFromAllTheCorrespondingStudents,
};

  