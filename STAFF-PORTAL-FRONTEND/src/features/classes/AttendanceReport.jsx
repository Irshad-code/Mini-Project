import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
// import { FiCalendar } from 'react-icons/fi';

export default function AttendanceReport() {
  const classId = useParams().classId;
  const BACKEND_LINK = import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;
  
  const [students, setStudents] = useState([]);
  const [totalClassDays, setTotalClassDays] = useState(0);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(BACKEND_LINK);
      const data = response.data.students || [];
      setStudents(data);

      // Calculate total unique class days from the first student's attendance
      if (data.length > 0) {
        const uniqueDates = new Set(data[0].classRecords[classId].attendanceDates);
        setTotalClassDays(uniqueDates.size);
      }
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
          Attendance Report
        </motion.h1>

        <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                <th className="px-6 py-4 text-sm font-semibold text-white">Roll No</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Days Present</th>
                <th className="px-6 py-4 text-sm font-semibold text-white">Attendance %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student, index) => {
                const daysPresent = student.classRecords[classId].attendanceDates.length;
                const attendancePercentage = totalClassDays > 0 
                  ? ((daysPresent / totalClassDays) * 100).toFixed(2)
                  : 0;

                return (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={student.studentId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 text-center">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      {daysPresent}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">
                      <span className={`px-3 py-1 rounded-full ${
                        attendancePercentage >= 75 ? 'bg-green-100 text-green-800' : 
                        attendancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendancePercentage}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
} 