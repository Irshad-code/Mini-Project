import { useState, useEffect } from "react";
import { FiCalendar, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Attendance() {
  const classId = useParams().classId;
  const navigate = useNavigate();
  console.log(classId);

  const BACKEND_LINK =
    import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;

  const [updatedStudentsId, setUpdatedStudentsId] = useState([]);

  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      console.log("Fetching Students.....");

      const response = await axios.get(BACKEND_LINK);

      console.log(
        "Response: ",
        response.data.students[0].classRecords[classId].attendanceDates
      );
      const data = response.data.students || [];

      setStudents(data);
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  async function handleAttendance(student) {
    console.log("student: ", student);
    const currentDate = date;
    console.log("currentDate: ", currentDate);
    try {
      // Step 2: Check if the date is already in attendance
      const attendanceDates =
        student.classRecords[classId].attendanceDates || [];
      console.log(" attendanceDates: ", attendanceDates);
      const isPresent = attendanceDates.some(
        (attDate) => attDate === currentDate
      );

      console.log("Is present: ", isPresent);

      setUpdatedStudentsId((prev) => [...prev, student.studentId]);
      console.log("student id: ", student.studentId);
      console.log("Updated Students: ", updatedStudentsId);

      // Step 3: Toggle attendance based on current state
      const updatedAttendanceDates = isPresent
        ? attendanceDates.filter((d) => d !== currentDate) // Remove date (mark as absent)
        : [...attendanceDates, currentDate]; // Add date (mark as present)

      console.log("Attendance toggled for:", student);

      // Step 5: Update UI state dynamically
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s.studentId === student.studentId
            ? {
                ...s,
                classRecords: {
                  ...s.classRecords,
                  [classId]: {
                    ...s.classRecords[classId],
                    attendanceDates: updatedAttendanceDates,
                  },
                },
              }
            : s
        )
      );
      console.log("updatedAttendanceDates: ", updatedAttendanceDates);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

  // Check if the date already exists in the attendance list

  async function setAllPresent() {
    try {
      // Identify students who are currently absent
      const newlyMarkedPresent = students.filter(
        (student) =>
          !student.classRecords[classId].attendanceDates.includes(date)
      );

      // Extract only the student IDs that were changed
      const updatedStudentIds = newlyMarkedPresent.map(
        (student) => student.studentId
      );

      // Update UI state only for those who were previously absent
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          updatedStudentIds.includes(student.studentId)
            ? {
                ...student,
                classRecords: {
                  ...student.classRecords,
                  [classId]: {
                    ...student.classRecords[classId],
                    attendanceDates: [
                      ...student.classRecords[classId].attendanceDates,
                      date, // Only add the date if it was missing
                    ],
                  },
                },
              }
            : student
        )
      );

      // Store only the updated students' IDs
      setUpdatedStudentsId(updatedStudentIds);
    } catch (error) {
      console.error("Error marking all students present:", error);
    }
  }

  console.log("Updated Students: ", updatedStudentsId);

  async function handleSubmit() {
    // This will later connect to backend
   
  const isConfirm = window.confirm(`Do you Want to Submit Attendence?`);



   if(isConfirm){
    console.log("Updated Students: ", updatedStudentsId);
    await axios.put(
      `http://localhost:3000/api/usermyclasses/attendance/update/${classId}`,
      { studentIdList: updatedStudentsId, date: date }
    );
   }

  
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-100 w-full"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center"
        >
          Daily Attendance Sheet
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 sm:mb-8 flex items-center justify-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gray-50 p-4 rounded-lg shadow-sm w-full sm:w-auto">
            <FiCalendar className="text-blue-500 text-xl" />
            <input
              type="date"
              value={date || ""}
              onChange={(e) =>
                setDate(new Date(e.target.value).toISOString().split("T")[0])
              }
              className="w-full sm:w-auto border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-4 py-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={setAllPresent}
              className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg shadow-md shadow-green-200"
            >
              Set All Present
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/attendance-report/${classId}`)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md shadow-blue-200"
            >
              View Report
            </motion.button>
          </div>

          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-xs sm:text-sm">
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-white text-center">
                  Roll No
                </th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-white text-center">
                  Name
                </th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-white text-center">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {students.map((student, index) => {
                const isPresent =
                  student.classRecords[classId].attendanceDates.includes(date);

                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={student.studentId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-center break-words text-gray-700">
                      {student.rollNumber}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-center break-words text-gray-700">
                      {student.name}
                    </td>
                    <td className="px-2 py-2 sm:px-6 sm:py-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAttendance(student)}
                        className={`px-2 py-1 rounded-lg flex items-center justify-center w-9 h-9 sm:min-w-[40px] sm:max-w-[80px] transition-all duration-200 ${
                          isPresent
                            ? "bg-green-500 text-white shadow-green-200"
                            : "bg-red-500 text-white shadow-red-200"
                        }`}
                        style={{
                          margin: "0 auto", // Centers the button in the table cell
                          display: "block", // Makes the button a block-level element to ensure centering works
                        }}
                      >
                        {isPresent ? <FiCheck size={20} /> : <FiX size={20} />}
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 sm:mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg 
                            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                            shadow-md shadow-blue-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <FiCheck className="text-lg" />
            <span>Submit Attendance</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
