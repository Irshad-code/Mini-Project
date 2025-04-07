import { useState, useEffect } from 'react'
import axios from 'axios';

export const UploadManually = ({
  myClass,
  columns,
  setStudents,
  setActiveForm,
  FormType
}) => {
  const [localStudents, setLocalStudents] = useState([]);
  const [showNumberInput, setShowNumberInput] = useState(true);
  const [numberOfStudents, setNumberOfStudents] = useState('');

  const handleNumberSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(numberOfStudents);
    if (num > 0) {
      setLocalStudents(
        Array.from({ length: num }, () =>
          Object.fromEntries(columns.map(({ key }) => [key, ""]))
        )
      );
      setShowNumberInput(false);
    }
  };

  const handleInputChange = (index, Key, value) => {
    setLocalStudents((prev) =>
      prev.map((student, i) => (i === index ? { ...student, [Key]: value } : student))
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStudents((prevStudents) => [...prevStudents, ...localStudents]);
    console.log("Submitted Student Details:", localStudents);
    setActiveForm(FormType.UPLOAD_STUDENTS);
    const res = await axios.post(`http://localhost:3000/api/usermyclasses/manualupload/${myClass.userclassesId}`, localStudents);
    console.log("response from handleSubmit: ", res);
  };

  if (showNumberInput) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
          <h1 className="text-xl font-bold mb-4 text-center">Enter Number of Students</h1>
          <form onSubmit={handleNumberSubmit}>
            <input
              type="number"
              min="1"
              value={numberOfStudents}
              onChange={(e) => setNumberOfStudents(e.target.value)}
              className="w-full border p-2 rounded-lg mb-4"
              placeholder="Enter number of students"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 w-[48%] rounded-lg"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
                className="bg-red-500 text-white py-2 w-[48%] rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[1000px] max-h-[80vh] overflow-auto ml-[260px]">
        <h1 className="text-xl font-bold mb-4 text-center">Upload Manually</h1>

        <form onSubmit={handleSubmit}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {columns.map(({ label }) => (
                  <th key={label} className="p-2">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localStudents.map((student, index) => (
                <tr key={index}>
                  {columns.map(({ key, type }) => (
                    <td key={key} className="p-2">
                      {type === "textarea" ? (
                        <textarea
                          className="border p-2 rounded-lg w-full"
                          value={student[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          required
                        />
                      ) : (
                        <input
                          type={type}
                          className="border p-2 rounded-lg w-full"
                          value={student[key]}
                          onChange={(e) => handleInputChange(index, key, e.target.value)}
                          required
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-green-500 text-white py-2 w-[48%] rounded-lg">
              Submit
            </button>
            <button
              type="button"
              onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
              className="bg-red-500 text-white py-2 w-[48%] rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};