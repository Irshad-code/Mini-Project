import { useState } from "react";
import { FiCalendar, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Attendance() {
  // Dummy student data
  const [students,setStudents] = useState([
    { id: 1, name: "John Doe", rollNo: "CS101", present: false },
    { id: 2, name: "Jane Smith", rollNo: "CS102", present: false },
    { id: 3, name: "Mike Johnson", rollNo: "CS103", present: false },
    { id: 4, name: "Sarah Williams", rollNo: "CS104", present: false },
    { id: 5, name: "Tom Brown", rollNo: "CS105", present: false },
  ]);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState(students);

  const handleAttendance = (studentId) => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, present: !student.present } // Toggle present state
          : student
      )
    );
  };

  const setAllPresent = () => {
    setAttendanceData((prevData) =>
      prevData.map((student) => ({ ...student, present: true }))
    );
  };
  
  const setAllAbsent = () => {
    setAttendanceData((prevData) =>
      prevData.map((student) => ({ ...student, present: false }))
    );
  };
  

  const handleSubmit = () => {
    // This will later connect to backend
    console.log({
      date,
      attendance: attendanceData,
    });
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={setAllAbsent}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md shadow-red-200"
        >
          Set Absent
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
              {attendanceData.map((student, index) => (
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium break-words text-gray-700 text-center">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 text-sm break-words text-gray-700 text-center">
                    {student.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                  <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleAttendance(student.id)}
  className={`px-2 py-1 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px] max-w-[80px]
      ${student.present 
          ? 'bg-green-500 text-white shadow-lg shadow-green-200'  
          : 'bg-red-500 text-white shadow-lg shadow-red-200'}`}
>
  {student.present ? <FiCheck size={25}/> : <FiX size={25}/>}
</motion.button>


                  </td>
                </motion.tr>
              ))}
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
