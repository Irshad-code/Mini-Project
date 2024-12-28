import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { FiUser, FiBarChart2, FiCheckCircle, FiCheckSquare, FiAward, FiDownload, FiEye } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const BatchDetails = () => {
  const students = [
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'CSE20001',
      batch: '2020-24',
      semester: 7,
      cgpa: 8.5,
      contact: '+91 9876543210',
      email: 'john@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'CSE20002',
      batch: '2020-24',
      semester: 7,
      cgpa: 9.2,
      contact: '+91 9876543211',
      email: 'jane@example.com',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Batch Details</h2>
        <Button variant="secondary" icon={<FiDownload />}>
          Export List
        </Button>
      </div>
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.rollNo}</p>
                <div className="mt-2 space-y-1">
                  <p>Batch: {student.batch}</p>
                  <p>Semester: {student.semester}</p>
                  <p>CGPA: {student.cgpa}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">{student.email}</p>
                <p className="text-sm">{student.contact}</p>
                <Button
                  variant="link"
                  className="mt-2"
                  icon={<FiEye />}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AcademicRecords = () => {
  const records = [
    {
      semester: 7,
      subjects: [
        { code: 'CS401', name: 'Machine Learning', grade: 'A', credits: 4 },
        { code: 'CS402', name: 'Cloud Computing', grade: 'A+', credits: 4 },
        { code: 'CS403', name: 'Big Data Analytics', grade: 'A', credits: 4 },
      ],
      sgpa: 9.2,
      cgpa: 8.5,
    },
    {
      semester: 6,
      subjects: [
        { code: 'CS301', name: 'Database Systems', grade: 'A', credits: 4 },
        { code: 'CS302', name: 'Web Technologies', grade: 'A+', credits: 4 },
        { code: 'CS303', name: 'Computer Networks', grade: 'B+', credits: 4 },
      ],
      sgpa: 8.8,
      cgpa: 8.3,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Academic Records</h2>
      {records.map((record) => (
        <Card key={record.semester} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Semester {record.semester}</h3>
            <div>
              <span className="mr-4">SGPA: {record.sgpa}</span>
              <span>CGPA: {record.cgpa}</span>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-center">Credits</th>
                <th className="px-4 py-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {record.subjects.map((subject) => (
                <tr key={subject.code}>
                  <td className="px-4 py-2">{subject.code}</td>
                  <td className="px-4 py-2">{subject.name}</td>
                  <td className="px-4 py-2 text-center">{subject.credits}</td>
                  <td className="px-4 py-2 text-center">{subject.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
};

const ScholarshipApprovals = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      student: 'John Doe',
      type: 'Merit Scholarship',
      amount: '50000',
      status: 'pending',
      date: '2023-12-25',
      documents: ['transcript.pdf', 'recommendation.pdf'],
    },
    {
      id: 2,
      student: 'Jane Smith',
      type: 'Research Grant',
      amount: '75000',
      status: 'pending',
      date: '2023-12-24',
      documents: ['proposal.pdf', 'publications.pdf'],
    },
  ]);

  const handleApproval = (id, approved) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: approved ? 'approved' : 'rejected' } : app
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Scholarship Applications</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{app.student}</h3>
                <p className="text-sm text-gray-600">{app.type}</p>
                <p className="mt-2">Amount: ₹{app.amount}</p>
                <p className="text-sm text-gray-600">Date: {app.date}</p>
                <div className="mt-2 space-x-2">
                  {app.documents.map((doc) => (
                    <Button
                      key={doc}
                      variant="link"
                      icon={<FiDownload />}
                      className="text-sm"
                    >
                      {doc}
                    </Button>
                  ))}
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="space-x-2">
                  <Button
                    variant="success"
                    onClick={() => handleApproval(app.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleApproval(app.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CreditApprovals = () => {
  const [creditRequests, setCreditRequests] = useState([
    {
      id: 1,
      student: 'John Doe',
      program: 'Online Course - Machine Learning',
      credits: 3,
      platform: 'Coursera',
      status: 'pending',
      documents: ['certificate.pdf', 'course_details.pdf'],
    },
    {
      id: 2,
      student: 'Jane Smith',
      program: 'Research Project',
      credits: 4,
      platform: 'University Research Cell',
      status: 'pending',
      documents: ['project_report.pdf', 'supervisor_letter.pdf'],
    },
  ]);

  const handleApproval = (id, approved) => {
    setCreditRequests(
      creditRequests.map((req) =>
        req.id === id ? { ...req, status: approved ? 'approved' : 'rejected' } : req
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Credit Transfer Requests</h2>
      <div className="grid gap-4">
        {creditRequests.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{request.student}</h3>
                <p className="text-sm text-gray-600">{request.program}</p>
                <div className="mt-2">
                  <p>Credits: {request.credits}</p>
                  <p>Platform: {request.platform}</p>
                </div>
                <div className="mt-2 space-x-2">
                  {request.documents.map((doc) => (
                    <Button
                      key={doc}
                      variant="link"
                      icon={<FiDownload />}
                      className="text-sm"
                    >
                      {doc}
                    </Button>
                  ))}
                </div>
              </div>
              {request.status === 'pending' && (
                <div className="space-x-2">
                  <Button
                    variant="success"
                    onClick={() => handleApproval(request.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleApproval(request.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      student: 'John Doe',
      title: 'Best Paper Award',
      event: 'International Conference on AI',
      date: '2023-11-15',
      description: 'Awarded for the research paper on Deep Learning applications',
      certificate: 'certificate.pdf',
    },
    {
      id: 2,
      student: 'Jane Smith',
      title: 'Hackathon Winner',
      event: 'National Level Hackathon',
      date: '2023-10-20',
      description: 'First prize in the innovation category',
      certificate: 'hackathon_certificate.pdf',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Achievements</h2>
        <Button variant="primary" icon={<FiAward />}>
          Add Achievement
        </Button>
      </div>
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.student}</p>
                <p className="mt-2">{achievement.event}</p>
                <p className="text-sm text-gray-600">Date: {achievement.date}</p>
                <p className="mt-2">{achievement.description}</p>
              </div>
              <Button
                variant="secondary"
                icon={<FiDownload />}
              >
                View Certificate
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function TutorshipFeature() {
  const { currentSection } = useNavigation();

  const renderSection = () => {
    switch (currentSection) {
      case 'batch-details':
        return <BatchDetails />;
      case 'academic-records':
        return <AcademicRecords />;
      case 'scholarships':
        return <ScholarshipApprovals />;
      case 'credit-approvals':
        return <CreditApprovals />;
      case 'achievements':
        return <Achievements />;
      default:
        return <BatchDetails />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSection()}
    </div>
  );
}
