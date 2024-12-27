import { useState } from "react";
import { Tab } from "@headlessui/react";
import { FiPlus, FiCalendar, FiUsers, FiBook, FiArchive } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TabButton from "../../components/ui/TabButton";

const tabs = [
  { id: "current", name: "Current Classes", icon: FiCalendar },
  { id: "archived", name: "Archived Classes", icon: FiArchive },
];

export default function MyClasses() {
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
        <Button variant="primary" icon={<FiPlus className="w-4 h-4" />}>
          Add New Class
        </Button>
      </div>

      <Tab.Group>
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
