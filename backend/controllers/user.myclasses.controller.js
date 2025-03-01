const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

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
    const id = req.params.id; // Get 'id' from URL
    console.log("Received ID:", id);

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

      const studentRecords = jsonData.map((student) => ({
        classId: classId,
        name: student["Name"],
        rollNumber: student["Roll Number"],
        email: student["Email"],
        phone: student["Phone"],
      }));
      const insertedStudents = await Student.insertMany(studentRecords);
      const studentIds = insertedStudents.map((s) => s._id);
      // Update the class to store student references
      await MyClass.findByIdAndUpdate(
        classId,
        { $push: { studentList: { $each: studentIds } } },
        { new: true }
      );

      return res
        .status(201)
        .json({
          message: `Excel uploaded successfully for class id= ${id}`,
          record: insertedStudents,
        });
    } catch (error) {
      return res.status(500).json({ error: "Error processing file." });
    }
  });
}

// ✅ Ensure the function is exported correctly
module.exports = { handleUploadExcel };

  