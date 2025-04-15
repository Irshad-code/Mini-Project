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
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_LINK}/usermyclasses/${classId}`);
      const data = response.data.students || [];
      setStudents(data);
    } catch (error) {
      console.error("Error fetching Students:", error);
    }
  };

  useEffect(() => {
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
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.studentId === editableStudentId ? editedStudent : student
      )
    );
    setEditableStudentId(null);
    setEditedStudent({});
    try {
      await axios.put(
        `${BACKEND_LINK}/usermyclasses/students/update/${classId}`,
        editedStudent
      );
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  const handleDelete = async (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.studentId !== studentId)
    );
    try {
      await axios.post(`${BACKEND_LINK}/usermyclasses/students/delete/${classId}`, {
        studentId,
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

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

    try {
      await axios.post(`${BACKEND_LINK}/usermyclasses/students/multi_delete/${classId}`, {
        studentIdList: selectedStudentIds,
      });
      setSelectedStudentIds([]);
    } catch (error) {
      console.error("Multi delete failed:", error);
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

        {/* Desktop Table */}
        <motion.div className="hidden sm:block overflow-x-auto rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <th className="px-4 py-2 text-center">Select</th>
                {["Roll No", "Name", "Phone", "Semester", "Branch", "Email", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-2 text-center">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.studentId)}
                      onChange={() => handleCheckboxChange(student.studentId)}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">{student.rollNumber}</td>
                  {["name", "phone", "semester", "branch", "email"].map((field) => (
                    <td key={field} className="px-4 py-2 text-center">
                      {editableStudentId === student.studentId ? (
                        <input
                          value={editedStudent[field]}
                          onChange={(e) => handleChange(e, field)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        student[field]
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    {editableStudentId === student.studentId ? (
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-orange-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() =>
                        window.confirm("Delete this student?") &&
                        handleDelete(student.studentId)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile Stacked Cards */}
        <div className="sm:hidden space-y-4 mt-4">
          {students.map((student) => (
            <div
              key={student.studentId}
              className="border rounded-lg p-4 shadow-md bg-gray-50 space-y-2"
            >
              <div className="flex justify-between items-center">
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(student.studentId)}
                  onChange={() => handleCheckboxChange(student.studentId)}
                  className="w-5 h-5"
                />
                <span className="font-semibold text-sm text-gray-700">Roll No: {student.rollNumber}</span>
              </div>

              {["name", "phone", "semester", "branch", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-xs text-gray-600 capitalize">{field}</label>
                  {editableStudentId === student.studentId ? (
                    <input
                      value={editedStudent[field]}
                      onChange={(e) => handleChange(e, field)}
                      className="w-full border px-2 py-1 rounded mt-1"
                    />
                  ) : (
                    <p className="text-sm">{student[field]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2 pt-2">
                {editableStudentId === student.studentId ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-orange-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() =>
                    window.confirm("Delete this student?") &&
                    handleDelete(student.studentId)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StudentPage;
