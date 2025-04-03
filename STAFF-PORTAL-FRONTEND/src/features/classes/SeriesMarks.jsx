import { useState,useEffect } from "react";
import { FiEdit, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function SeriesMarks() {
  const [students, setStudents] = useState([]);

  const classId = useParams().classId;
  console.log(classId);
  const BACKEND_LINK =  import.meta.env.VITE_API_URL + `/usermyclasses/${classId}`;

   const fetchStudents = async () => {
      try {
        console.log("Fetching Students.....");
    
        const response = await axios.get(BACKEND_LINK);
    
        console.log("Response: ", response.data.students);
        const data = response.data.students || [];
    
        setStudents(data);
        console.log("fetch Students: ", data );
    
        
      } catch (error) {
        console.error("Error fetching Students:", error);
      }
    };
    
  
    useEffect(() => {
      fetchStudents();
   
    }, []);

  const [editMode, setEditMode] = useState({
    studentId: null,
    attribute: null,
  });
  const [tempMarks, setTempMarks] = useState(
    {
      series1Marks: {},
      series2Marks: {},
    }
  );

  const handleEdit = (id, marks, attribute) => {
    setEditMode({
      studentId: id,
      attribute: attribute,
    });

    setTempMarks((prev) => ({
      ...prev,
      [attribute]: {
        ...prev[attribute],
        [id]: marks, // Store marks in the correct attribute (series1Marks or series2Marks)
      },
    }));
  };


 async function studentUpdate(student, attribute, marksValue) {
   try {
     // Create a deep copy of student to avoid state mutation
     let updateStudent = {
       ...student,
       classRecords: {
         ...student.classRecords,
         [classId]: {
           ...student.classRecords[classId],
           [attribute]: marksValue, // Use the passed marksValue directly
         },
       },
     };

     console.log("axios: ", updateStudent);

     const res = await axios.put(
       `http://localhost:3000/api/student/update/${student.studentId}`,
       updateStudent
     );

     return res.data.message;
   } catch (error) {
     console.error("Error updating student:", error);
     alert("Failed to update student marks. Please try again.");
   }
 }

  const handleSave = (student, attribute) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === student.studentId
          ? {
              ...s,
              classRecords: {
                ...s.classRecords,
                [classId]: {
                  ...s.classRecords[classId],
                  [attribute]:
                    tempMarks[attribute]?.[student.studentId] ||
                    s.classRecords[classId][attribute],
                },
              },
            }
          : s
      )
    );

    // Ensure the value is not undefined before calling the update
    const marksValue = tempMarks[attribute]?.[student.studentId];

    if (marksValue === undefined || marksValue === "") {
      alert("Marks cannot be empty!");
      return;
    }

    studentUpdate(student, attribute, marksValue); // Pass marksValue to ensure correct data
    setEditMode({});
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
          Series Marks Sheet
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
                  Series1
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">
                  Series2
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student) => (
                <motion.tr
                  key={student.studentId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-sm font-medium  text-gray-700 break-words whitespace-normal text-center w-20">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium  text-gray-700 break-words whitespace-normal text-center w-32 sm:w-auto">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    {editMode.studentId === student.studentId &&
                    editMode.attribute === "series1Marks" ? (
                      <input
                        type="number"
                        value={tempMarks.series1Marks[student.studentId] || ""}
                        onChange={(e) =>
                          setTempMarks((prev) => ({
                            ...prev,
                            series1Marks: {
                              ...prev.series1Marks,
                              [student.studentId]: e.target.value, // Updates series1Marks
                            },
                          }))
                        }
                        className="border p-1 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200 w-16 text-sm text-center"
                      />
                    ) : (
                      <span className="text-gray-700">
                        {student.classRecords[classId].series1Marks}
                      </span>
                    )}

                    {editMode.studentId === student.studentId &&
                    editMode.attribute === "series1Marks" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSave(student, "series1Marks")}
                        className="bg-green-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center ml-2"
                      >
                        <FiCheck className="text-md" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleEdit(
                            student.studentId,
                            student.classRecords[classId].series1Marks,
                            "series1Marks"
                          )
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center ml-2"
                      >
                        <FiEdit className="text-md" size={20} />
                      </motion.button>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center align-middle">
                    {editMode.studentId === student.studentId &&
                    editMode.attribute === "series2Marks" ? (
                      <input
                        type="number"
                        value={tempMarks.series2Marks[student.studentId] || ""}
                        onChange={(e) =>
                          setTempMarks((prev) => ({
                            ...prev,
                            series2Marks: {
                              ...prev.series2Marks,
                              [student.studentId]: e.target.value, // Updates series2Marks
                            },
                          }))
                        }
                        className="border p-1 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200 w-16 text-sm text-center"
                      />
                    ) : (
                      <span className="text-gray-700">
                        {student.classRecords[classId].series2Marks}
                      </span>
                    )}

                    {editMode.studentId === student.studentId &&
                    editMode.attribute === "series2Marks" ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSave(student, "series2Marks")}
                        className="bg-green-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center ml-2"
                      >
                        <FiCheck className="text-md" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleEdit(
                            student.studentId,
                            student.classRecords[classId].series2Marks,
                            "series2Marks"
                          )
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md text-sm flex items-center justify-center ml-2"
                      >
                        <FiEdit className="text-md" size={20} />
                      </motion.button>
                    )}
                  </td>

                  {/*/input field and buttn of series 2 */}
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
