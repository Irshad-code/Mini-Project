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

async function handleUploadManual(req, res) {
  const classId = req.params.id; // Get 'id' from URL
  console.log("Received class ID:", classId);
  const jsonData = req.body; // Get JSON data from request body
   try {
 
      // Extract rollNumbers & emails from Excel data
      const rollNumbers = jsonData.map((student) => student["rollNumber"]);
      const emails = jsonData.map((student) => student["email"]);
      // Step 1: Check existing students in Db with same rollNumber or email
      const existingStudents = await studentModel.find({
        $or: [{ rollNumber: { $in: rollNumbers } }, { email: { $in: emails } }],
      });

      // Step 2: Filter out from duplicate students
      const existingRollNumbers = new Set(existingStudents.map((s) => s.rollNumber));

      const existingEmails = new Set(existingStudents.map((s) => s.email));

      const existingStudentIdList = new Set(existingStudents.map((s) => s._id));// Extract student IDs from the student collection in Db

      const uniqueStudents = jsonData.filter(
        (student) =>
          !existingRollNumbers.has(student["rollNumber"]) &&
          !existingEmails.has(student["email"])
      );

      if (uniqueStudents.length === 0) {
        // Step 3: Add the studentId to the existing class's studentList
        const existingClass = await UserMyClassesModel.findById(classId);
        // Get student IDs that are NOT already in the class's studentList
        const newStudentIdsToInsertFromDb = Array.from(
          existingStudentIdList
        ).filter((studentId) => !existingClass.studentList.includes(studentId));

        if (!newStudentIdsToInsertFromDb.length) {
          return res.status(202).json({
            message:
              "These students are already present in the class, so nothing is inserted.",
          });
        }
        // Update the class with new student IDs from existing students data from Db
        existingClass.studentList = [
          ...existingClass.studentList,
          ...newStudentIdsToInsertFromDb,
        ];

        await existingClass.save(); // Explicitly save the class

        // Add the classId to each student's classRecords, ensuring it has the correct structure
        await studentModel.updateMany(
          { _id: { $in: Array.from(newStudentIdsToInsertFromDb) } }, // Match all existing students
          {
            $set: {
              [`classRecords.${classId}`]: {
                // ✅ Ensure classRecords stores an object, not just an ID
                series1Marks: 0,
                series2Marks: 0,
                attendanceDates: [],
                internalMarks: 0,
              },
            },
          }
        );

        return res.status(203).json({
          message:
            "No students found outside of the Db, so inserted existing students Id from Db to the class as mentioned in Excel",
          studentIdList: newStudentIdsToInsertFromDb,
        });
      }

      const studentRecords = uniqueStudents.map((student) => ({
        classList: [classId],
        name: student["name"],
        rollNumber: student["rollNumber"],
        email: student["email"],

        phone: student["phone"],
        semester: student["semester"],
        branch: student["branch"],
        classRecords: {
          [classId]: {
            series1Marks: 0,
            series2Marks: 0,
            attendanceDates: [],
            internalMarks: 0,
          },
        },
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
}

// Handle excel file upload
async function handleUploadExcel(req, res) {
  const classId = req.params.id; // Get 'id' from URL
  console.log("Received class ID:", classId);

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
      console.log("json data: ", jsonData);
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

      const existingStudentIdList = new Set(existingStudents.map((s) => s._id));// Extract student IDs from the student collection in Db

      const uniqueStudents = jsonData.filter(
        (student) =>
          !existingRollNumbers.has(student["Roll Number"]) &&
          !existingEmails.has(student["Email"])
      );

      if (uniqueStudents.length === 0) {
        // Step 3: Add the studentId to the existing class's studentList
        const existingClass = await UserMyClassesModel.findById(classId);
        // Get student IDs that are NOT already in the class's studentList
        const newStudentIdsToInsertFromDb = Array.from(
          existingStudentIdList
        ).filter((studentId) => !existingClass.studentList.includes(studentId));

        if (!newStudentIdsToInsertFromDb.length) {
          return res.status(202).json({
            message:
              "These students are already present in the class, so nothing is inserted.",
          });
        }
        // Update the class with new student IDs from existing students data from Db
        existingClass.studentList = [
          ...existingClass.studentList,
          ...newStudentIdsToInsertFromDb,
        ];

        await existingClass.save(); // Explicitly save the class

        // Add the classId to each student's classRecords, ensuring it has the correct structure
        await studentModel.updateMany(
          { _id: { $in: Array.from(newStudentIdsToInsertFromDb) } }, // Match all existing students
          {
            $set: {
              [`classRecords.${classId}`]: {
                // ✅ Ensure classRecords stores an object, not just an ID
                series1Marks: 0,
                series2Marks: 0,
                attendanceDates: [],
                internalMarks: 0,
              },
            },
          }
        );

        return res.status(203).json({
          message:
            "No students found outside of the Db, so inserted existing students Id from Db to the class as mentioned in Excel",
          studentIdList: newStudentIdsToInsertFromDb,
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
        classRecords: {
          [classId]: {
            series1Marks: 0,
            series2Marks: 0,
            attendanceDates: [],
            internalMarks: 0,
          },
        },
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

async function completeListOfAllStudentsFromClass(req, res) {
  const classId = req.params.id;
  try {
    const classData = await UserMyClassesModel.findById(classId).select(
      "studentList"
    );

    if (
      !classData ||
      !classData.studentList ||
      classData.studentList.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No students found in this class" });
    }
    //  Find students whose _id is in studentList
    const students = await studentModel.find({
      _id: { $in: classData.studentList },
    });

    return res.status(200).json(
      { message: "Students found",
        students 
        });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching students", error });
  }
}

async function handleAttendanceOFStudents(req, res) {
    const classId = req.params.id;
    const { studentIdList, date } = req.body; // Expecting list of student IDs and a date

    try {
   
      const updatedStudents = [];

      // Step 2: Process each student in the list
      for (const studentId of studentIdList) {
        // Step 3: Find student record
        const student = await studentModel.findById(studentId);
        if (!student) {
          return res
            .status(404)
            .json({ message: `Student with ID ${studentId} not found` });
        }

        // Step 5: Add or remove date from attendance list
        const classRecord = student.classRecords.get(classId);
        const attendanceDatesList = classRecord.get("attendanceDates");
        console.log("attendanceDatesList: ", attendanceDatesList);

///////////////////////////////////////////////////////////////////////
        const Class = await UserMyClassesModel.findById(classId);
        // Check if the date already exists in the attendance list of class
        if (!Class.attendanceDateList.includes(date)) {
          Class.attendanceDateList.push(date);
        }
        //else{
        //   Class.attendanceDateList=Class.attendanceDateList.filter(attDate => attDate !== date);
        // }
        await Class.save();
        console.log("class dateList: ",Class.attendanceDateList);
///////////////////////////////////////////////////////////////////////

        // Check if the date already exists in the attendance list of student
        const dateExists = attendanceDatesList.some(
          (attDate) => attDate === date
        );

        if (dateExists) {
          // Date found → Remove it (mark absent)
          student.classRecords.get(classId).attendanceDates =
            attendanceDatesList.filter((attDate) => attDate !== date);
        } else {
          // Date not found → Add it (mark present)
          attendanceDatesList.push(date);
          student.classRecords.get(classId).attendanceDates =
            attendanceDatesList;
        }

        await student.save();

        // Collect updated students for response
        updatedStudents.push(studentId);
      }

      return res.status(200).json({
        message: `Attendance updated successfully.`,
        updatedStudents,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error updating attendance`,
        error: error.message,
      });
    }
  
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

async function deleteMultipleStudentsFromAllClasses(req, res,next) {
  const studentIds = req.body.idList;
  try {
    // Step 1: Find all classes that contain the studentIds
    const classes = await UserMyClassesModel.find({
      studentList: { $in: studentIds },
    });

    if (!classes.length) {
      console.log( "No classes found." );
      return next();
    }

    // Step 2: Remove studentIds from each class's studentList
    const updatePromises = classes.map((cls) =>
      UserMyClassesModel.findByIdAndUpdate(cls._id, {
        $pull: { studentList: { $in: studentIds } },
      })
    );

    await Promise.all(updatePromises); // Execute all updates in parallel
    next();

  }catch(error){
    return res.status(500).json(
      { message: "Error deleting multiple student ids from all classes",
        errors:error.errors
      })
}
}

async function insertStudentIdToCorrespondingClass(req, res) {
const {
  name,
  rollNumber,
  semester,
  branch,
  email,
  phone,
  classRecords, // Now directly extracting the classRecords object
} = req.body;

  try {
    // Step 1: Check if the student already exists
    let student = await studentModel.findOne({ rollNumber });

    if (!student) {
      // If student doesn't exist, create a new student object
      student = new studentModel({
        name,
        rollNumber,
        semester,
        branch,
        email,
        phone,
        classRecords: {}, // Initialize classRecords as an empty object
      });
    }

    // Step 2: Add or update classRecords for the given classId
    student.classRecords = classRecords;

    const savedStudent = await student.save(); // Save student to DB

    // Step 3: Check if the class exists
    const classIds = Object.keys(classRecords); // Extract classIds from classRecords
    let existingClasses = []; // To store successfully updated class details

    for (const classId of classIds) {
      const existingClass = await UserMyClassesModel.findById(classId);
      if (!existingClass) {
        return res.status(404).json({
          message: `Class : ${classId} not found`,
        });
      }

      // Step 4: Add studentId to the class's studentList
      const studentId = savedStudent._id;
      if (!existingClass.studentList.includes(studentId)) {
        existingClass.studentList.push(studentId);
        await existingClass.save(); // Explicitly save the class
      }
      // Store the class details in the list
      existingClasses.push({
        classId: existingClass._id,
        subject: existingClass.subject,
        className: existingClass.name,
      });
    }

    return res.status(201).json({
      message: `Student ${
        savedStudent.name
      } inserted successfully into respective classes.`,
      student_Id: savedStudent._id,
      assignedClasses: existingClasses, // Sending the class details in response
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error inserting student id to corresponding class`,
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
  handleUploadManual,
  deleteStudentIdFromAllClasses,
  insertStudentIdToCorrespondingClass,
  deleteClassIdFromAllTheCorrespondingStudents,
  deleteMultipleStudentsFromAllClasses,
  handleAttendanceOFStudents,
  completeListOfAllStudentsFromClass,
};

  