import { useState ,useEffect} from "react";
import { Tab } from "@headlessui/react";
import { FiPlus, FiCalendar, FiUsers, FiBook, FiArchive, FiX, FiEdit } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TabButton from "../../components/ui/TabButton";
import axios from 'axios';
import { Form } from "./Form.jsx";

const tabs = [
  { id: "current", name: "Current Classes", icon: FiCalendar },
  { id: "archived", name: "Archived Classes", icon: FiArchive },
];

 const BACKEND_LINK = import.meta.env.VITE_API_URL + "/usermyclasses";

export default function MyClasses() {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [newClass, setNewClass] = useState({
    subject: "",
    code: "",
    semester: "",
    branch: "",
    students: "",
    schedule: ""
  });

  const [classes, setClasses] = useState({
    current: [
      {
        id: 1,
        subject: "Data Structures",
        code: "CS201", 
        semester: "S3",
        branch: "CSE",
        students: 60,
        schedule: "Monday, Wednesday 10:00 AM",
        syllabus: "path/to/syllabus.pdf",
        courseOutcome: "path/to/co.pdf",
      },
      {
        id: 2,
        subject: "Database Management",
        code: "CS202",
        semester: "S4",
        branch: "CSE",
        students: 55,
        schedule: "Tuesday, Thursday 2:00 PM",
        syllabus: "path/to/syllabus.pdf",
        courseOutcome: "path/to/co.pdf",
      },
    ],
    archived: [
      {
        id: 3,
        subject: "Programming in Python",
        code: "CS101",
        semester: "S2",
        branch: "CSE",
        students: 62,
        year: "2023",
        result: "95% Pass",
        syllabus: "path/to/syllabus.pdf",
        courseOutcome: "path/to/co.pdf",
        finalReport: "path/to/report.pdf",
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleEdit = (classItem) => {
    setIsEditing(true);
    setEditingClassId(classItem.id);
    setNewClass({
      subject: classItem.subject,
      code: classItem.code,
      semester: classItem.semester,
      branch: classItem.branch,
      students: classItem.students.toString(),
      schedule: classItem.schedule
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any field is empty or contains only whitespace
    const hasEmptyFields = Object.values(newClass).some(value => !value.toString().trim());
    
    if (hasEmptyFields) {
      alert("Please fill in all fields properly");
      return;
    }

    // Validate number of students is greater than 0
    const numStudents = parseInt(newClass.students);
    if (numStudents <= 0) {
      alert("Number of students must be greater than 0");
      return;
    }

    if (isEditing) {
      try {
        // Update the class in the backend
        // const response = await fetch(`/api/classes/${editingClassId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     ...newClass,
        //     students: numStudents
        //   }),
        // });
        
        // if (!response.ok) throw new Error('Failed to update class');

        // Update local state
        setClasses(prev => ({
          ...prev,
          current: prev.current.map(c => 
            c.id === editingClassId ? {
              ...c,
              ...newClass,
              students: numStudents
            } : c
          )
        }));
      } catch (error) {
        alert("Failed to update class. Please try again.");
        return;
      }
    } else {
      try {
        const newId = Math.max(...classes.current.map(c => c.id)) + 1;
        const classToAdd = {
          id: newId,
          ...newClass,
          students: numStudents,
          syllabus: "path/to/syllabus.pdf",
          courseOutcome: "path/to/co.pdf",
        };

        // Add the class to the backend
        // const response = await fetch('/api/classes', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(classToAdd),
        // });
        
        // if (!response.ok) throw new Error('Failed to add class');
        
        // Update local state
        setClasses(prev => ({
          ...prev,
          current: [...prev.current, classToAdd]
        }));
      } catch (error) {
        alert("Failed to add class. Please try again.");
        return;
      }
    }
    
    setShowForm(false);
    setIsEditing(false);
    setEditingClassId(null);
    setNewClass({
      subject: "",
      code: "",
      semester: "",
      branch: "",
      students: "",
      schedule: ""
    });
  };
    current: [],
    archived: [],
  });

const handleChange = (e) => {
    setNewClassData({ ...newClassData, [e.target.name]: e.target.value });
};

const fetchClasses = async () => {
      try{
        const response = await axios.get(BACKEND_LINK);
        const data = response.data;

        const current=data.filter(cls=>!cls.isArchived);
        const archived = data.filter(cls => cls.isArchived);
        
        setClasses({
          current,
          archived
        });

        console.log("fetch classes: ",data);
      
      }catch(error){
        console.error('Error fetching classes:', error);
      };
    }

  useEffect(() => {
      fetchClasses();
  },[]);

  async function onAdd_class(){
    setisModelOpen(false); 
    console.log("before response got \n sending data is ="+JSON.stringify(newClassData));
    const response = await axios.post(`${BACKEND_LINK}/create`,newClassData);
    console.log("response got is=",response.data.record);

     setClasses((Classes) => ({
      current: [...Classes.current, response.data.record],  // ✅ Add to current classes
      archived: Classes.archived                     // Keep archived unchanged
    }));
  
    setNewClassData({ // Reset the form
            subject: "",
            code: "",
            semester: "",
            branch: "",
            students: "",
            schedule: "",
            syllabus: "",
            courseOutcome: "",
        });
 }

 async function onUpdate_class(updatedClassData){
  -
  //const response = await axios.put(`${BACKEND_LINK}/update/${classID}`,updatedClassData);
  console.log("class update ")
 }

 async function onDelete_class(classID){
        try {
          const response = await axios.delete(`${BACKEND_LINK}/delete/${classID}`);
          if(response){
            console.log("Class deleted successfully.");
          }
          fetchClasses();  //update the UI
        } catch (error) {
          console.log(error);
        }
 }

  const renderClassCard = (classItem, type) => (
    <Card key={classItem.id} className={`p-6 hover:shadow-lg transition-shadow ${showForm ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {classItem.subject}
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {classItem.code} • {classItem.semester} {classItem.branch}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
              <FiUsers className="w-4 h-4" />
              <span>{classItem.students} students</span>
            </div>
            {type === "current" && (
              <Button
                variant="ghost"
                onClick={() => handleEdit(classItem)}
                icon={<FiEdit className="w-4 h-4" />}
                className="hover:bg-gray-100 rounded-full"
              />
            )}
          </div>
        </div>

        {type === "current" ? (
          <div className="space-y-2">
            <p className="text-[var(--color-text-secondary)] flex items-center space-x-2">
              <FiCalendar className="w-4 h-4" />
              <span>{classItem.schedule}</span>
              <Button 
              onClick={()=>{
                console.log("id= ",classItem.userclassesId);
                onDelete_class(classItem.userclassesId);
              }} 
              className="bg-black"
              >Delete
              </Button>

              {/* <Button onClick={
                ()=>{
                  setisModelUpdateOpen(true);
                  console.log(`clicked update btn and IsModelUpdateOpen is ${isModelUpdateOpen}`);
                   }
              }>edit On
              </Button> */}

              <Button onClick={()=>{
                setisModelUpdateOpen(true);
               // setisModelOpen(true);
                console.log("IsModelUpdateOpen :",isModelUpdateOpen);
              }}>
                Update
              </Button>
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                Course Files
              </Button>
              <Button variant="secondary" className="w-full">
                Attendance
              </Button>
              <Button variant="secondary" className="w-full">
                Internal Marks
              </Button>
              <Button variant="secondary" className="w-full">
                Series Marks
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Year: {classItem.year}</span>
              <span>Result: {classItem.result}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                View Report
              </Button>
              <Button variant="secondary" className="w-full">
                Course Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
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
          variant="primary" 
          icon={<FiPlus className="w-4 h-4" />}
          onClick={() => setShowForm(true)}
        >
          Add New Class
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {isEditing ? 'Edit Class' : 'Add New Class'}
              </h3>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditingClassId(null);
                  setNewClass({
                    subject: "",
                    code: "",
                    semester: "",
                    branch: "",
                    students: "",
                    schedule: ""
                  });
                }}
                icon={<FiX className="w-5 h-5" />}
                className="hover:bg-gray-100 rounded-full"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={newClass.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    value={newClass.code}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={newClass.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={newClass.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Number of Students</label>
                  <input
                    type="number"
                    name="students"
                    value={newClass.students}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    value={newClass.schedule}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full py-3"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setEditingClassId(null);
                    setNewClass({
                      subject: "",
                      code: "",
                      semester: "",
                      branch: "",
                      students: "",
                      schedule: ""
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                >
                  {isEditing ? 'Update Class' : 'Add Class'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Tab.Group onChange={()=>fetchClasses()}>
        <Tab.List className="flex space-x-2 border-b border-[var(--color-border-primary)]">
          {tabs.map((tab, index) => (
            <TabButton key={tab.id} index={index} name={tab.name} />
          ))}
        </Tab.List>

{isModelUpdateOpen && <Form
          setIsModelOpen={setisModelOpen}

          isModelUpdateOpen={isModelUpdateOpen} 
          setIsModelUpdateOpen={setisModelUpdateOpen}

          onAdd_class={onAdd_class}
          onUpdate_class={onUpdate_class}

          newClassData={newClassData}

          handleChange={handleChange}
        />}

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.current.map((classItem) =>
                renderClassCard(classItem, "current")
              )}
            </div>
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
    </div>
  );
}

