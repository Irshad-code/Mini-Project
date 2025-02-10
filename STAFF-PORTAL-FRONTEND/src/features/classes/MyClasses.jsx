import { useState ,useEffect} from "react";
import { Tab } from "@headlessui/react";
import { FiPlus, FiCalendar, FiUsers, FiBook, FiArchive } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TabButton from "../../components/ui/TabButton";
import axios from 'axios';

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

    const newClassCard = {
        "subject": "subject name",
        "code": "subject code",
        "semester": "semester",
        "branch": "branch",
        
        "students": 1,
        "schedule": "schedule date and time",
        "syllabus": "syllabus_link",
        "courseOutcome": "courseOutcome_link"
    };
   

    console.log("before response got \n sending data is ="+JSON.stringify(newClassCard));
    const response = await axios.post(`${BACKEND_LINK}/create`,newClassCard);
    console.log("response got is=",response.data.record);

     setClasses((Classes) => ({
      current: [...Classes.current, response.data.record],  // ✅ Add to current classes
      archived: Classes.archived                     // Keep archived unchanged
    }));

    fetchClasses();  //update the UI
    
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
    <Card key={classItem.id} className="p-6 hover:shadow-lg transition-shadow">
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
          <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
            <FiUsers className="w-4 h-4" />
            <span>{classItem.students} students</span>
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
        <Button onClick={()=>{
          onAdd_class();
          console.log("clicked on Add_new_classbtn");
          }} variant="primary" icon={<FiPlus className="w-4 h-4" />}>
          Add New Class
        </Button>
      </div> 

      <Tab.Group onChange={()=>fetchClasses()}>
        <Tab.List className="flex space-x-2 border-b border-[var(--color-border-primary)]">
          {tabs.map((tab, index) => (
            <TabButton key={tab.id} index={index} name={tab.name} />
          ))}
        </Tab.List>

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

