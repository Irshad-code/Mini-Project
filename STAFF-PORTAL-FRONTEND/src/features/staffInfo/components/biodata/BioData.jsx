import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiDownload, FiEye } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import Card from "../../../../components/ui/Card";

const sections = [
  {
    id: "personal",
    title: "Personal Information",
    fields: ["name", "dateOfBirth", "gender", "nationality", "maritalStatus"],
  },
  {
    id: "contact",
    title: "Contact Details",
    fields: ["email", "phone", "address", "city", "state", "pincode"],
  },
  {
    id: "academic",
    title: "Academic Details",
    fields: ["education", "specialization", "university", "yearOfPassing"],
  },
  {
    id: "research",
    title: "Research Details",
    fields: ["publications", "projects", "patents"],
  },
  {
    id: "service",
    title: "Service Details",
    fields: ["currentPosition", "department", "experience", "appointments"],
  },
];

export default function BioData() {
  const [biodata, setBiodata] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch biodata from API/context
  useEffect(() => {
    // Mock data for now
    setBiodata({
      personal: {
        name: "John Doe",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        nationality: "Indian",
        maritalStatus: "Single",
      },
      contact: {
        email: "john@example.com",
        phone: "+91 9876543210",
        address: "123 Main St",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
      },
      academic: {
        education: [
          {
            degree: "Ph.D",
            specialization: "Computer Science",
            university: "IIT Delhi",
            yearOfPassing: "2015",
          },
        ],
      },
      research: {
        publications: [
          {
            title: "Machine Learning in Education",
            journal: "IEEE Education",
            year: "2020",
          },
        ],
        projects: [
          {
            title: "Smart Learning Platform",
            duration: "2 years",
            funding: "UGC",
          },
        ],
      },
      service: {
        currentPosition: "Associate Professor",
        department: "Computer Science",
        experience: "10 years",
        appointments: [
          {
            position: "Assistant Professor",
            institution: "ABC College",
            period: "2015-2020",
          },
        ],
      },
    });
  }, []);

  const handleEdit = (sectionId) => {
    setEditingSection(sectionId);
    setPreviewMode(false);
  };

  const handleDelete = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setBiodata((prev) => {
        const newBiodata = { ...prev };
        delete newBiodata[sectionId];
        return newBiodata;
      });
    }
  };

  const handleSave = (sectionId, data) => {
    setBiodata((prev) => ({
      ...prev,
      [sectionId]: data,
    }));
    setEditingSection(null);
  };

  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  const renderSectionContent = (section) => {
    const data = biodata[section.id];
    if (!data) return null;

    switch (section.id) {
      case "personal":
      case "contact":
        return (
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field}>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </span>
                <p className="font-medium">{data[field]}</p>
              </div>
            ))}
          </div>
        );
      case "academic":
        return (
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-[var(--color-primary-500)] pl-4">
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {edu.specialization} • {edu.university} • {edu.yearOfPassing}
                </p>
              </div>
            ))}
          </div>
        );
      case "research":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Publications</h4>
              <div className="space-y-2">
                {data.publications.map((pub, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{pub.title}</p>
                    <p className="text-[var(--color-text-secondary)]">
                      {pub.journal} • {pub.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Projects</h4>
              <div className="space-y-2">
                {data.projects.map((proj, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{proj.title}</p>
                    <p className="text-[var(--color-text-secondary)]">
                      {proj.duration} • Funded by {proj.funding}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "service":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  Current Position:
                </span>
                <p className="font-medium">{data.currentPosition}</p>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  Department:
                </span>
                <p className="font-medium">{data.department}</p>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  Experience:
                </span>
                <p className="font-medium">{data.experience}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Previous Appointments</h4>
              <div className="space-y-2">
                {data.appointments.map((app, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{app.position}</p>
                    <p className="text-[var(--color-text-secondary)]">
                      {app.institution} • {app.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Biodata
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Generate and manage your professional biodata
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            onClick={() => setPreviewMode(!previewMode)}
            icon={<FiEye className="w-4 h-4" />}
          >
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button
            variant="primary"
            onClick={handleGeneratePDF}
            icon={<FiDownload className="w-4 h-4" />}
          >
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                {section.title}
              </h3>
              {!previewMode && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(section.id)}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(section.id)}
                    icon={<FiTrash2 className="w-4 h-4" />}
                  />
                </div>
              )}
            </div>
            {renderSectionContent(section)}
          </Card>
        ))}
      </div>
    </div>
  );
}
