import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { FiPlus, FiCalendar, FiUsers, FiBook, FiArchive } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TabButton from "../../components/ui/TabButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadManually } from "./UploadManually";

import RenderClassCard from "./RenderClassCard";

import AddClassCard from "./AddClassCard";

import EditClassCard from "./EditClassCard";

// import DefaultPage from "./DefaultPage";



const tabs = [
  { id: "current", name: "Current Classes", icon: FiCalendar },
  { id: "archived", name: "Archived Classes", icon: FiArchive },
];

const BACKEND_LINK = import.meta.env.VITE_API_URL + "/usermyclasses";

export default function MyClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState({
    current: [],
    archived: [],
  });

  const FormType={
    ADD_CLASS:'addClass',
    EDIT_CLASS:"editClass",
    NUM_CLASS_PROMPT:"numClassPrompt",
    UPLOAD_STUDENTS:"uploadStudents",
    UPLOAD_STUDENTS_EXCEL:"uploadStudentsExcel",
    UPLOAD_STUDENTS_MANUALLY:"uploadStudentsManually",
    NONE:"none"
  }

  const[activeForm,setActiveForm]=useState(FormType.NONE);

  const [editingClass, setEditingClass] = useState(null);
  const [numClasses, setNumClasses] = useState(1);
  const [newClasses, setNewClasses] = useState([
    {
      subject: "",
      code: "",
      semester: "",
      branch: "",
      students: "",
      schedule: "",
      syllabus: "",
      courseOutcome: "",
    },
  ]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(BACKEND_LINK);
      const data = response.data || [];

      const current = data.filter((cls) => !cls.isArchived);
      const archived = data.filter((cls) => cls.isArchived);

      setClasses({
        current,
        archived,
      });

      console.log("fetch classes: ", data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses({
        current: [],
        archived: [],
      });
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleNumClassesSubmit = () => {
    setNewClasses(
      Array(numClasses).fill({
        subject: "",
        code: "",
        semester: "",
        branch: "",
        students: "",
        schedule: "",
        syllabus: "",
        courseOutcome: "",
      })
    );
    setActiveForm(FormType.ADD_CLASS)
    
  };

  const updateNewClass = (index, field, value) => {
    const updatedClasses = [...newClasses];
    updatedClasses[index] = {
      ...updatedClasses[index],
      [field]: value,
    };
    setNewClasses(updatedClasses);
  };

  async function onAdd_classes(e) {
    e.preventDefault();

    // Validate all classes
    for (let classData of newClasses) {
      if (
        !classData.students ||
        isNaN(classData.students) ||
        parseInt(classData.students) <= 0
      ) {
        console.error(
          "Number of students must be greater than 0 for all classes"
        );
        return;
      }
    }

    try {
      // Add all classes sequentially
      for (let classData of newClasses) {
        const formattedData = {
          ...classData,
          students: parseInt(classData.students),
        };
        await axios.post(`${BACKEND_LINK}/create`, formattedData);
      }

      await fetchClasses();
      setActiveForm(FormType.NONE)
      setNewClasses([
        {
          subject: "",
          code: "",
          semester: "",
          branch: "",
          students: "",
          schedule: "",
          syllabus: "",
          courseOutcome: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding classes:", error);
    }
  }

  //To updload student details
  

  const [students, setStudents] = useState([]);
  




  const [myClass,setMyClass] = useState(null);

  

  
  function uploadExcelOrManually(classItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h1 className="text-xl font-bold mb-4 text-center">
            {`Upload Students For ${classItem.subject}`}
          </h1>
          <div className="flex flex-col gap-4">
            <button
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => {
              
                setActiveForm(FormType.UPLOAD_STUDENTS_EXCEL);

                  console.log("id= ", classItem.userclassesId);
                }}
            >
              Upload Excel
            </button>
   
            <button
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => {
                
                setActiveForm(FormType.UPLOAD_STUDENTS_MANUALLY);
              
                
              }}
            >
              Upload Manually
            </button>

            <button
              className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => {
                setActiveForm(FormType.NONE);

              }}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  
 
  

  async function onDelete_class(classID) {
    try {
      const response = await axios.delete(`${BACKEND_LINK}/delete/${classID}`);
      if (response) {
        console.log("Class deleted successfully.");
        setClasses((prevClasses) => ({
          current: prevClasses.current.filter(
            (cls) => cls.userclassesId !== classID
          ),
          archived: prevClasses.archived.filter(
            (cls) => cls.userclassesId !== classID
          ),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function handleStudentExcelDataUpload(classID,file){
       
    console.log("Hello" , classID);    

     if (!file) {
    console.error("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("excelFile", file); // 'excelFile' should match the backend's expected key


        try {
      const response = await axios.post(`${BACKEND_LINK}/upload/${classID}`,
            formData, 
          {
             headers: {
             "Content-Type": "multipart/form-data",
                },
          });

      if (response) {
        console.log("Students excel sheet uploaded successfully.\n DATA= ",response.data.record);
        // setClasses(prevClasses => ({
        //   current: prevClasses.current.filter(cls => cls.userclassesId !== classID),
        //   archived: prevClasses.archived.filter(cls => cls.userclassesId !== classID)
        // }));
      }
    } catch (error) {
    
      console.log(error);
      
    }
  }

const renderClassCard= (classItem,type)=>{
    return (
      <RenderClassCard
      classItem={classItem}
      type={type}
      setEditingClass={setEditingClass}
      setActiveForm={setActiveForm}
      setMyClass={setMyClass}
      FormType={FormType}
      onDelete_class={onDelete_class}
      />
    )
}

  return (
    <div className="space-y-6">
      {activeForm===FormType.NUM_CLASS_PROMPT ? (
        <Card className="p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">
              How many classes would you like to add?
            </label>
            <input
              type="number"
              min="1"
              value={numClasses}
              onChange={(e) => setNumClasses(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveForm(FormType.NONE)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNumClassesSubmit}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      ) : activeForm===FormType.ADD_CLASS  ? (

        <AddClassCard
        newClasses={newClasses}
        updateNewClass={updateNewClass}
        onAdd_classes={onAdd_classes}
        setActiveForm={setActiveForm}
        FormType={FormType}
        />
      ) : activeForm=== FormType.EDIT_CLASS  ? (

        <EditClassCard
        editingClass={editingClass} setEditingClass={setEditingClass} setActiveForm={setActiveForm} FormType={FormType}
        />
      ): true &&  (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                My Classes
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                Manage your current and archived classes
              </p>
            </div>
            <Button
              onClick={() => setActiveForm(FormType.NUM_CLASS_PROMPT)}
              variant="primary"
              icon={<FiPlus className="w-4 h-4" />}
            >
              Add New Classes
            </Button>
          </div>

          <Tab.Group onChange={() => fetchClasses()}>
            <Tab.List className="flex space-x-2 border-b border-[var(--color-border-primary)]">
              {tabs.map((tab, index) => (
                <TabButton key={tab.id} index={index} name={tab.name} />
              ))}
            </Tab.List>

            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.current.map((classItem) =>(
                    renderClassCard(classItem, "current")

                  )
                  )}
                </div>

                {activeForm===FormType.UPLOAD_STUDENTS && (uploadExcelOrManually(myClass))}

      { (activeForm===FormType.UPLOAD_STUDENTS_MANUALLY) && <UploadManually
  myClass={myClass}
  columns={[
    { label: "ID", key: "id", type: "text" },
    { label: "Name", key: "name", type: "text" },
    { label: "Phone Number", key: "phone", type: "tel" },
    { label: "Photo", key: "photo", type: "file" }, // Image upload
    { label: "Address", key: "address", type: "textarea" }
  ]}
  setStudents={setStudents}
  setActiveForm={setActiveForm}
  FormType={FormType}
/>}

{activeForm===FormType.UPLOAD_STUDENTS_EXCEL && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-lg font-semibold">Upload Excel File</h3>
      
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) =>
          handleStudentExcelDataUpload(myClass.userclassesId, e.target.files[0])
        }
        className="mt-3 border p-2 rounded w-full"
      />
      
      <div className="flex justify-end gap-48 mt-4">
      <button
          onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Ok
        </button>

        <button
          onClick={() => setActiveForm(FormType.UPLOAD_STUDENTS)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


              </Tab.Panel>
              <Tab.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.archived.map((classItem) =>
                    renderClassCard(classItem, "archived")
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>

// <DefaultPage
//      setActiveForm={setActiveForm}
//      FormType={FormType}
//      fetchClasses={fetchClasses}
//      tabs={tabs}
//      classes={classes}
//      renderClassCard={renderClassCard}
//      activeForm={activeForm}
//      uploadExcelOrManually={uploadExcelOrManually}
//      myClass={myClass}
//      setStudents={setStudents}
//      handleStudentExcelDataUpload={handleStudentExcelDataUpload}
// />

      )
    
    }
    </div>
  );
}
