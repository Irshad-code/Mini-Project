import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

function StudentPage() {
  const { classId } = useParams();
  const BACKEND_LINK = `${import.meta.env.VITE_API_URL}`;
  const [students, setStudents] = useState([]);
  const [editableStudentId, setEditableStudentId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});

  const fetchStudents = async () => {
    try {
      console.log("Fetching Students...");
      const response = await axios.get(`${BACKEND_LINK}/usermyclasses/${classId}`);
      const data = response.data.students || [];
      setStudents(data);
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };

  useEffect(() => {
    console.log("Backend Link: ", `${BACKEND_LINK}/usermyclasses/students/update/${classId}`);
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setEditableStudentId(student.studentId);
    setEditedStudent(student);
  };

  const handleChange = (e, field) => {
    setEditedStudent((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    // Immediately update the UI
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.studentId === editableStudentId ? editedStudent : student
      )
    );

    setEditableStudentId(null);
    setEditedStudent({});
    console.log("Edited Student: ", editedStudent);
    // Try saving in the background
    try {
      const response = await axios.put(
        `${BACKEND_LINK}/usermyclasses/students/update/${classId}`,
        editedStudent
      );
      console.log("Student updated:", response.data);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Failed to save changes.");
    }
  };

  const handleDelete = async (studentId) => {
    // Immediately update the UI
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.studentId !== studentId)
    );

    // Try deleting in background
    try {
      const jsonData = {
        studentId: studentId,
      };
      const response = await axios.post(`${BACKEND_LINK}/usermyclasses/students/delete/${classId}`, jsonData);
      console.log("Student deleted:", response.data);
    } catch (error) {
      console.log("Delete failed:", error.response?.data || error.message);
    }
  };

  ////////////////////////////////////////////////////

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.studentId));
    }
  };

  const handleMultiDelete = async () => {
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete the selected students?");
    if (!confirm) return;

    setStudents((prev) =>
      prev.filter((student) => !selectedStudentIds.includes(student.studentId))
    );

    const jsonData = {
      studentIdList: selectedStudentIds,
    };

    try {
      await axios.post(`${BACKEND_LINK}/usermyclasses/students/multi_delete/${classId}`, jsonData);
      setSelectedStudentIds([]);
    } catch (error) {
      console.error("Multi delete failed:", error.response?.data || error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8 max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 border border-gray-100"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center"
        >
          Student Management
        </motion.h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedStudentIds.length === students.length && students.length > 0}
              onChange={handleSelectAll}
              className="w-6 h-6"
            />
            <label htmlFor="selectAll" className="text-lg font-medium text-gray-700">
              Select All
            </label>
          </div>

          {selectedStudentIds.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMultiDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Delete Selected
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full overflow-x-auto rounded-xl shadow-sm border border-gray-100"
        >
          <table className="min-w-full table-auto sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                <th className="px-4 py-2 text-sm font-semibold text-white text-center">Select</th>
                {["Roll No", "Name", "Phone", "Semester", "Branch", "Email", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-2 text-sm font-semibold text-white text-center break-words whitespace-normal max-w-[150px]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student, index) => (
                <motion.tr
                  key={student.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.studentId)}
                      onChange={() => handleCheckboxChange(student.studentId)}
                    />
                  </td>

                  <td className="px-4 py-2 text-sm text-center">{student.rollNumber}</td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <input
                        value={editedStudent.name}
                        onChange={(e) => handleChange(e, "name")}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      student.name
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <input
                        value={editedStudent.phone}
                        onChange={(e) => handleChange(e, "phone")}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      student.phone
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <input
                        value={editedStudent.semester}
                        onChange={(e) => handleChange(e, "semester")}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      student.semester
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <input
                        value={editedStudent.branch}
                        onChange={(e) => handleChange(e, "branch")}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      student.branch
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <input
                        value={editedStudent.email}
                        onChange={(e) => handleChange(e, "email")}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      student.email
                    )}
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    {editableStudentId === student.studentId ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg shadow-md shadow-green-200 mr-2"
                      >
                        Save
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(student)}
                        className="px-3 py-1 bg-orange-500 text-white rounded-lg shadow-md shadow-orange-200 mr-2"
                      >
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this student?")) {
                          handleDelete(student.studentId);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md shadow-red-200"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default StudentPage;
