import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FiBookOpen, FiUsers, FiCalendar, FiFile, FiCheck, FiArchive } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MyClassesFeature() {
  const [classes] = useState({
    current: [
      {
        id: 1,
        subject: 'Data Structures',
        code: 'CS201',
        semester: 3,
        branch: 'CSE',
        students: 60,
        schedule: 'Mon, Wed, Fri - 10:00 AM',
      },
      {
        id: 2,
        subject: 'Database Management',
        code: 'CS301',
        semester: 5,
        branch: 'CSE',
        students: 55,
        schedule: 'Tue, Thu - 2:00 PM',
      },
    ],
    archived: [
      {
        id: 3,
        subject: 'Programming Fundamentals',
        code: 'CS101',
        semester: 1,
        branch: 'CSE',
        students: 65,
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        year: '2023',
      },
    ],
  });

  const renderClassCard = (classItem, isArchived = false) => (
    <Card key={classItem.id} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{classItem.subject}</h3>
          <p className="text-sm text-gray-600">{classItem.code}</p>
          <div className="mt-2 space-y-1">
            <p className="flex items-center">
              <FiCalendar className="mr-2" />
              {classItem.schedule}
            </p>
            <p className="flex items-center">
              <FiUsers className="mr-2" />
              {classItem.students} Students
            </p>
            <p>Semester: {classItem.semester}</p>
            <p>Branch: {classItem.branch}</p>
            {isArchived && <p>Year: {classItem.year}</p>}
          </div>
        </div>
        <div className="space-y-2">
          {!isArchived && (
            <>
              <Button variant="primary" icon={<FiFile />}>
                Course Files
              </Button>
              <Button variant="secondary" icon={<FiCheck />}>
                Attendance
              </Button>
              <Button variant="secondary" icon={<FiCheck />}>
                Internal Marks
              </Button>
              <Button variant="secondary" icon={<FiCheck />}>
                Series Marks
              </Button>
              <Button variant="danger" icon={<FiArchive />}>
                Archive
              </Button>
            </>
          )}
          {isArchived && (
            <Button variant="secondary" icon={<FiFile />}>
              View Records
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <FiBookOpen className="mr-2" />
              Current Classes
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center">
              <FiArchive className="mr-2" />
              Archived Classes
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <div className="space-y-4">
              {classes.current.map((classItem) => renderClassCard(classItem))}
            </div>
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <div className="space-y-4">
              {classes.archived.map((classItem) => renderClassCard(classItem, true))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
