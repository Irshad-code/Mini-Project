import { useState, useEffect } from "react";
import { FiCalendar, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Attendance() {
  const classId = useParams().classId;
  console.log(classId);

   const BACKEND_LINK = import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;

  const [updatedStudentsId,setUpdatedStudentsId] = useState([]);

  

  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      console.log("Fetching Students.....");
  
      const response = await axios.get(BACKEND_LINK);
  
      console.log(
        "Response: ",
        response.data.students[0].classRecords[classId].attendanceDates);
      const data = response.data.students || [];
  
      // Ensure attendance records are correctly mapped
      // const formattedStudents = data.map((student) => ({
      //   ...student,
      //   classRecords: student.classRecords || {}, // Ensure classRecords is always an object
      // }));
  
      setStudents(data);
      //console.log("fetch Students: ", data[0].classRecords[classId].attendanceDates );
  
      
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };
  

  useEffect(() => {
    fetchStudents();
 
  }, []);

  const [date, setDate] = useState(new Date());
  // const[dateExists,setDateExists] = useState(false);
  async function handleAttendance(student) {
   console.log("student: ",student);

    try {
  
      // Step 2: Check if the date is already in attendance
      const attendanceDates = student.classRecords[classId].attendanceDates || [];
     const isPresent = attendanceDates.some(
  (attDate) => new Date(attDate).toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
);

      console.log("Is present: ",isPresent);

      setUpdatedStudentsId((prev) => [...prev, student.studentId]);
      console.log("student id: ",student.studentId);
      console.log("Updated Students: ",updatedStudentsId);
  
      // Step 3: Toggle attendance based on current state
      const updatedAttendanceDates = isPresent
        ? attendanceDates.filter((d) => d !== date) // Remove date (mark as absent)
        : [...attendanceDates, date]; // Add date (mark as present)
  
      console.log("Attendance toggled for:", student);
  
      // Step 5: Update UI state dynamically
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s.id === student.studentId
            ? {
                ...s,
                classRecords: {
                  ...s.classRecords,
                  [date]: {
                    ...(s.classRecords?.[date] || {}),
                    attendanceDates: updatedAttendanceDates // Set new toggled value
                  }
                }
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

  async function setAllPresent  ()  {

    const studentsIdList = students.map((student) => student.studentId);

    console.log(studentsIdList);

       
    await axios.put(BACKEND_LINK, {
      studentIdList: studentsIdList,
      date: date,
    });
  };

  console.log("Updated Students: ", updatedStudentsId);

async function  handleSubmit  () {
    // This will later connect to backend
    console.log("Updated Students: ", updatedStudentsId);
    await axios.put(`http://localhost:3000/api/usermyclasses/attendance/update/${classId}`,{studentIdList: updatedStudentsId, date: date});

    //  setUpdatedStudentsId([]);

    


    alert("Attendance submitted successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
        >
          Daily Attendance Sheet
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 flex items-center justify-center"
        >
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm">
            <FiCalendar className="text-blue-500 text-xl" />
            <input
              type="date"
              value={date ? date.toISOString().split("T")[0] : ""}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="overflow-x-auto rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5 items-center"
        >
          <motion.div className="flex  flex-wrap gap-10 space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={setAllPresent}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md shadow-green-200"
            >
              Set Present
            </motion.button>
          </motion.div>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                <th className="px-6 py-4 text-sm font-semibold text-white break-words tracking-wider whitespace-normal text-center">
                  Roll No
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white break-words tracking-wider whitespace-normal text-center">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-white   break-words tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
            {students.map((student, index) => {
  console.log(`Student attendance dates of index ${index}:`, student.classRecords[classId].attendanceDates); // ✅ Properly logging student object

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      key={student.studentId} // ✅ Fallback key
      className="hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="px-6 py-4 text-sm font-medium break-words text-gray-700 text-center">
        {student.rollNumber}
      </td>
      <td className="px-6 py-4 text-sm break-words text-gray-700 text-center">
        {student.name}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAttendance(student)}
          className={`px-2 py-1 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px] max-w-[80px]
    ${
      Object.values(student.classRecords).some((record) => {
        console.log("attendance dates: ", record.attendanceDates);
        console.log("date: ", date.toISOString().split("T")[0]);

        return record.attendanceDates.some(
          (attDate) =>
            new Date(attDate).toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
        );
      })
        ? "bg-green-500 text-white shadow-lg shadow-green-200"
        : "bg-red-500 text-white shadow-lg shadow-red-200"
    }`}
        >
          {Object.values(student.classRecords).some((record) =>
            record.attendanceDates.some(
              (attDate) =>
                new Date(attDate).toISOString().split("T")[0] ===
                date.toISOString().split("T")[0]
            )
          ) ? (
            <FiCheck size={25} />
          ) : (
            <FiX size={25} />
          )}
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
          className="mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg 
                            hover:from-blue-600 hover:to-blue-700 transition-all duration-200 
                            shadow-lg shadow-blue-200 font-medium text-sm flex items-center space-x-2"
          >
            <FiCheck className="text-lg" />
            <span>Submit Attendance</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
