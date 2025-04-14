import { useState, useEffect } from "react";
import { FiCalendar,FiArchive } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import axios from "axios";

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
      code: "",
      subject: "",
      semester: "",
      type: "ordinary",
      branch: "",
      fromTime: "",             // added
      toTime: "",               // added
      schedule: "",             // still needed
      showScheduleEditor: false, // added for UI toggle
      currentClass: true,
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
    const newArray = Array.from({ length: numClasses }, () => ({
      code: "",
      subject: "",
      semester: "",
      type: "ordinary",
      branch: "",
      fromTime: "",             // added
      toTime: "",               // added
      schedule: "",             // still needed
      showScheduleEditor: false, // added for UI toggle
      currentClass: true,
    }));
  
    setNewClasses(newArray);
    setActiveForm(FormType.ADD_CLASS);
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
  
    const cleanedClasses = [];
  
    for (let i = 0; i < newClasses.length; i++) {
      const classData = newClasses[i];
      const {
        subject,
        code,
        semester,
        type,
        branch,
        fromTime,
        toTime,
        currentClass,
      } = classData;
  
      if (
        !subject ||
        !code ||
        !semester ||
        (type === "ordinary" && !branch) ||
        !fromTime ||
        !toTime
      ) {
        alert(`Please fill out all fields for class #${i + 1}`);
        return;
      }
  
      // Construct formatted schedule
      
        const convertTo12Hour = (time24) => {
        const [hour, minute] = time24.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`;
      };
      
     
      
      const schedule = `${convertTo12Hour(fromTime)} - ${convertTo12Hour(toTime)}`;
  
      cleanedClasses.push({
        subject,
        code,
        semester,
        type,
        branch: type === "ordinary" ? branch : "", // Clear branch for other types
        schedule,
        currentClass,
      });
    }

    console.log("Class Data ", cleanedClasses)
  
    try {
      for (const classData of cleanedClasses) {
        await axios.post(`${BACKEND_LINK}/create`, classData);
      }
  
      await fetchClasses();
  
      // Reset form
      setActiveForm(FormType.NONE);
      setNewClasses([
        {
          subject: "",
          code: "",
          semester: "",
          type: "ordinary",
          branch: "",
          fromTime: "",
          toTime: "",
          schedule: "",
          showScheduleEditor: false,
          currentClass: true,
        },
      ]);
    } catch (error) {
      console.error("Error adding classes:", error);
      alert("Error adding classes, please try again later.");
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

  // function to handle refreshing classes smoothly
  const handleRefreshClasses = async () => {
    await fetchClasses();
  };

  // Modify the renderClassCard function to pass the refresh callback
  const renderClassCard = (classItem, type) => {
    return (
      <RenderClassCard
        classItem={classItem}
        type={type}
        setEditingClass={setEditingClass}
        setActiveForm={setActiveForm}
        setMyClass={setMyClass}
        FormType={FormType}
        onDelete_class={onDelete_class}
        refreshClasses={handleRefreshClasses}  
      />
    );
  };

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
