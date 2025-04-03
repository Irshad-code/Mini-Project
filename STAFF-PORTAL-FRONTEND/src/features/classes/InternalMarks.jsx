import { useState , useEffect} from "react";
import { FiEdit, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function InternalMarks() {
  const [students, setStudents] = useState([]);
  const classId = useParams().classId;
  console.log(classId);
  const BACKEND_LINK =  import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;

  const fetchStudents = async () => {
    try {
      console.log("Fetching Students.....");
  
      const response = await axios.get(
        BACKEND_LINK
      );
  
      console.log("Response: ", response.data.students);
      const data = response.data.students || [];
  
      // Ensure attendance records are correctly mapped
      // const formattedStudents = data.map((student) => ({
      //   ...student,
      //   classRecords: student.classRecords || {}, // Ensure classRecords is always an object
      // }));
  
      setStudents(data);
      console.log("fetch Students: ", data );
  
      
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };
  

  useEffect(() => {
    fetchStudents();
 
  }, []);

  const [editMode, setEditMode] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  const handleEdit = (id, marks) => {
    setEditMode(id);
    setTempMarks((prev) => ({ ...prev, [id]: marks }));
  };

  async function studentUpdate(student){
    const res = await axios.put(`http://localhost:3000/api/student/update/${student.id}`,student);
    return res.message;
  }
  const handleSave = (Student) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === Student.id
          ? { ...student, marks: tempMarks[Student.id] }
          : student
      )
    );
    studentUpdate(Student);
    setEditMode(null);
  };

  const handleSubmit = () => {
    console.log("Internal Marks Submitted:", students);
    alert("Marks submitted successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <motion.div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
        <motion.h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Internal Marks Sheet
        </motion.h1>

        <motion.div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                <th className="px-4 py-4 text-sm font-semibold text-white tracking-wider w-20">
                  Roll No.
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">
                  Marks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student) => (
                <motion.tr
                  key={student.studentID}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-sm font-medium  text-gray-700 break-words whitespace-normal text-center w-20">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium  text-gray-700 break-words whitespace-normal text-center w-32 sm:w-auto">
                    {student.name}
                  </td>
                  <td className="px-6 py-4  flex flex-wrap gap-5 justify-center items-center space-y-2">
                    {editMode === student.id ? (
                      <input
                        type="number"
                        value={tempMarks[student.id]}
                        onChange={(e) =>
                          setTempMarks({
                            ...tempMarks,
                            [student.id]: e.target.value,
                          })
                        }
                        className="border p-1 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200 w-16 text-sm text-center"
                      />
                    ) : (
                      <span className="text-gray-700">
                        {
                          student.classRecords[classId].internalMarks
                        }
                      </span>
                    )}
                    {editMode === student.id ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSave(student)}
                        className="bg-green-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center"
                      >
                        <FiCheck className="text-md" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(student.id, student.marks)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center"
                      >
                        <FiEdit className="text-md" size={20} />
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg shadow-blue-200 font-medium text-sm flex items-center space-x-2"
          >
            <FiCheck className="text-lg" />
            <span>Submit Marks</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
