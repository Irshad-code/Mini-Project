import { useState, useEffect } from "react";
import { FiCalendar,FiArchive } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import RenderClassCard from "./RenderClassCard";

import AddClassCard from "./AddClassCard";

import EditClassCard from "./EditClassCard";

import DefaultPage from "./DefaultPage";



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

      const current = data.filter((cls) => cls.currentClass);
      const archived = data.filter((cls) => !cls.currentClass);

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
        currentClass: true,
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
          currentClass: true,// it should be builded on UI
        },
      ]);
    } catch (error) {
      console.error("Error adding classes:", error);
    }
  }

  //To updload student details
  

  const [students, setStudents] = useState([]);
  
  const [myClass,setMyClass] = useState(null);

  

  
  
  


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
      const response = await axios.post(
        `${BACKEND_LINK}/excelupload/${classID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
        fetchClasses={fetchClasses}
        />
      ): true &&  (
 <DefaultPage
     setActiveForm={setActiveForm}
     FormType={FormType}
     fetchClasses={fetchClasses}
     tabs={tabs}
     classes={classes}
     renderClassCard={renderClassCard}
     activeForm={activeForm}
     myClass={myClass}
     setStudents={setStudents}
     handleStudentExcelDataUpload={handleStudentExcelDataUpload}
/> 

      )
    }
    </div>
  );
}
