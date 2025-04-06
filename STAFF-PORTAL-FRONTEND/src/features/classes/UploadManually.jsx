import{useState,useEffect} from 'react'
import axios from 'axios';

export const UploadManually = (
  {  myClass,
     columns,
     setStudents,
     setActiveForm,
     FormType }
        ) => {
    const [localStudents, setLocalStudents] = useState([]);
  
    useEffect(() => {
      // Initialize state dynamically based on columns
      setLocalStudents(
        Array.from({ length: myClass.students }, () =>
          Object.fromEntries(columns.map(({ key }) => [key, ""])) // Create empty fields
        )
      );
    }, [myClass.students, columns]);
  
    const handleInputChange = (index, Key, value) => {
      setLocalStudents((prev) =>
        prev.map((student, i) => (i === index ? { ...student, [Key]: value } : student))
      );
    };
    
    async function handleSubmit(e){
      e.preventDefault();
      setStudents((prevStudents) => [...prevStudents, ...localStudents]); // Append new data
      console.log("Submitted Student Details:", localStudents);
      setActiveForm(FormType.UPLOAD_STUDENTS);
      const res=await axios.post(`http://localhost:3000/api/usermyclasses/manualupload/${myClass.userclassesId}`,localStudents);
      console.log("response from handleSubmit: ",res);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[1000px] max-h-[80vh] overflow-auto">
          <h1 className="text-xl font-bold mb-4 text-center">Upload Manually</h1>
  
          <form onSubmit={handleSubmit}>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {columns.map(({ label }) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localStudents.map((student, index) => (
                  <tr key={index}>
                    {columns.map(({ key, type }) => (
                      <td key={key}>
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
                onClick={() => {
        
                  setActiveForm(FormType.UPLOAD_STUDENTS);
                  console.log(myClass.userClassesid)
                }}
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
  