import { useState, useEffect } from "react";
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    subject: "",
    code: "",
    semester: "",
    branch: "",
    students: "",
    schedule: "",
    syllabus: "",
    courseOutcome: ""
  });

  const fetchClasses = async () => {
    try {
      const response = await axios.get(BACKEND_LINK);
      const data = response.data || []; // Handle empty response

      const current = data.filter(cls => !cls.isArchived);
      const archived = data.filter(cls => cls.isArchived);

      setClasses({
        current,
        archived
      });

      console.log("fetch classes: ", data);

    } catch (error) {
      console.error('Error fetching classes:', error);
      // Set empty arrays if error occurs
      setClasses({
        current: [],
        archived: []
      });
    };
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  async function onAdd_class(e) {
    e.preventDefault();

    // Validate students field
    if (!newClass.students || isNaN(newClass.students) || parseInt(newClass.students) <= 0) {
      console.error("Number of students must be greater than 0");
      return;
    }

    const classData = {
      ...newClass,
      students: parseInt(newClass.students)
    };

    try {
      const response = await axios.post(`${BACKEND_LINK}/create`, classData);
      console.log("response got is=", response.data.record);

      await fetchClasses(); // Fetch updated data from backend

      setShowAddForm(false);
      setNewClass({
        subject: "",
        code: "",
        semester: "",
        branch: "",
        students: "",
        schedule: "",
        syllabus: "",
        courseOutcome: ""
      });
      
    } catch (error) {
      console.error("Error adding class:", error);
    }
  }

  async function onEdit_class(e) {
    e.preventDefault();

    if (!editingClass.students || isNaN(editingClass.students) || parseInt(editingClass.students) <= 0) {
      console.error("Number of students must be greater than 0");
      return;
    }

    const classData = {
      ...editingClass,
      students: parseInt(editingClass.students)
    };

    try {
      const response = await axios.put(`${BACKEND_LINK}/update/${editingClass.userclassesId}`, classData);
      console.log("Class updated successfully:", response.data);

      await fetchClasses();
      setShowEditForm(false);
      setEditingClass(null);

    } catch (error) {
      console.error("Error updating class:", error);
    }
  }

  async function onDelete_class(classID) {
    try {
      const response = await axios.delete(`${BACKEND_LINK}/delete/${classID}`);
      if (response) {
        console.log("Class deleted successfully.");
        // Immediately update the UI by filtering out the deleted class
        setClasses(prevClasses => ({
          current: prevClasses.current.filter(cls => cls.userclassesId !== classID),
          archived: prevClasses.archived.filter(cls => cls.userclassesId !== classID)
        }));
      }
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
                onClick={() => {
                  setEditingClass(classItem);
                  setShowEditForm(true);
                }}
                className="bg-blue-500"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  console.log("id= ", classItem.userclassesId);
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
      {!showAddForm && !showEditForm ? (
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
              onClick={() => setShowAddForm(true)}
              variant="primary"
              icon={<FiPlus className="w-4 h-4" />}
            >
              Add New Class
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
        </>
      ) : showAddForm ? (
        <Card className="p-6">
          <form onSubmit={onAdd_class} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name</label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject Code</label>
                <input
                  type="text"
                  value={newClass.code}
                  onChange={(e) => setNewClass({...newClass, code: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <input
                  type="text"
                  value={newClass.semester}
                  onChange={(e) => setNewClass({...newClass, semester: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={newClass.branch}
                  onChange={(e) => setNewClass({...newClass, branch: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Students</label>
                <input
                  type="number"
                  value={newClass.students}
                  onChange={(e) => setNewClass({...newClass, students: e.target.value})}
                  min="1"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Schedule</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Syllabus</label>
                <input
                  type="text"
                  value={newClass.syllabus}
                  onChange={(e) => setNewClass({...newClass, syllabus: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Outcome</label>
                <input
                  type="text"
                  value={newClass.courseOutcome}
                  onChange={(e) => setNewClass({...newClass, courseOutcome: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Class
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={onEdit_class} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingClass.subject}
                  onChange={(e) => setEditingClass({...editingClass, subject: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject Code</label>
                <input
                  type="text"
                  value={editingClass.code}
                  onChange={(e) => setEditingClass({...editingClass, code: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <input
                  type="text"
                  value={editingClass.semester}
                  onChange={(e) => setEditingClass({...editingClass, semester: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={editingClass.branch}
                  onChange={(e) => setEditingClass({...editingClass, branch: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Students</label>
                <input
                  type="number"
                  value={editingClass.students}
                  onChange={(e) => setEditingClass({...editingClass, students: e.target.value})}
                  min="1"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Schedule</label>
                <input
                  type="text"
                  value={editingClass.schedule}
                  onChange={(e) => setEditingClass({...editingClass, schedule: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Syllabus</label>
                <input
                  type="text"
                  value={editingClass.syllabus}
                  onChange={(e) => setEditingClass({...editingClass, syllabus: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Outcome</label>
                <input
                  type="text"
                  value={editingClass.courseOutcome}
                  onChange={(e) => setEditingClass({...editingClass, courseOutcome: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => {
                setShowEditForm(false);
                setEditingClass(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
