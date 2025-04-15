import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function AttendanceReport() {
  const { classId } = useParams();
  const BACKEND_LINK =
    import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;

  const [students, setStudents] = useState([]);
  const [attendanceDateList, setAttendanceDateList] = useState([]);

  async function fetchAttendanceDateList() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usermyclasses/"
      );
      const classData = response.data.find(
        (cls) => cls.userclassesId === classId
      );
      if (classData) {
        setAttendanceDateList(classData.attendanceDateList || []);
      } else {
        console.log("Class not found!");
        setAttendanceDateList([]);
      }
    } catch (error) {
      console.error("Error fetching attendance date list:", error);
      setAttendanceDateList([]);
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get(BACKEND_LINK);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceDateList();
    fetchStudents();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8 max-w-full mx-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-100"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center"
        >
          Attendance Report
        </motion.h1>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                <th className="px-6 py-4 text-sm font-semibold text-white text-left sm:text-center">
                  Roll No
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white text-left sm:text-center">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white text-left sm:text-center">
                  Days Present
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white text-left sm:text-center">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student, index) => {
                const daysPresent =
                  student.classRecords?.[classId]?.attendanceDates?.length || 0;
                const totalDays = attendanceDateList.length;
                const attendancePercentage =
                  totalDays > 0
                    ? ((daysPresent / totalDays) * 100).toFixed(2)
                    : 0;

                    console.log("Total Days ",totalDays);
                    console.log("dsys Present ",daysPresent)


                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={student.studentId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-left sm:text-center">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-left sm:text-center">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-left sm:text-center">
                      {daysPresent}/{totalDays}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-left sm:text-center">
                      <div className="w-full bg-gray-400 rounded-full h-6">
                        <div
                          className={`h-6 rounded-full text-xs font-semibold text-white text-center`}
                          style={{
                            width: `${attendancePercentage}%`,
                            backgroundColor:
                              attendancePercentage >= 75
                                ? "#34D399" // green
                                : attendancePercentage >= 60
                                ? "#FBBF24" // yellow
                                : "#F87171", // red
                          }}
                        >
                          {attendancePercentage}%
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {students.map((student, index) => {
            const daysPresent =
              student.classRecords?.[classId]?.attendanceDates?.length || 0;
            const totalDays = attendanceDateList.length;
            const attendancePercentage =
              totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(2) : 0;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={student.studentId}
                className="border border-gray-400 rounded-xl p-4 shadow-sm bg-white"
              >
                <p className="text-sm font-semibold text-gray-700">
                  <span className="font-bold">Roll No:</span>{" "}
                  {student.rollNumber}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  <span className="font-bold">Name:</span> {student.name}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  <span className="font-bold">Days Present:</span> {daysPresent}/{totalDays}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  <span className="font-bold">Attendance:</span>{" "}
                  <div className="w-full bg-gray-400 rounded-full h-6 mt-1">
                    <div
                      className="h-6 rounded-full text-xs font-semibold text-white text-center"
                      style={{
                        width: `${attendancePercentage}%`,
                        backgroundColor:
                          attendancePercentage >= 75
                            ? "#34D399" // green
                            : attendancePercentage >= 60
                            ? "#FBBF24" // yellow
                            : "#F87171", // red
                      }}
                    >
                      {attendancePercentage}%
                    </div>
                  </div>
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
