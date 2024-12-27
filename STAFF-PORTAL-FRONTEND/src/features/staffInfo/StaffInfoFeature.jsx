import { Suspense, lazy } from "react";
import {
  FiUser,
  FiBook,
  FiAward,
  FiBriefcase,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { useNavigation } from "../../contexts/NavigationContext";
import Card from "../../components/ui/Card";
import PageContainer from "../../components/layout/PageContainer";
import DashboardCard from "../../components/dashboard/DashboardCard";

// Lazy load sub-features
const PersonalInfo = lazy(() => import("./components/personal/PersonalInfo"));
const AcademicInfo = lazy(() => import("./components/academic/AcademicInfo"));
const ResearchInfo = lazy(() => import("./components/research/ResearchInfo"));
const EmployerInfo = lazy(() => import("./components/employer/EmployerInfo"));
const ServiceInfo = lazy(() => import("./components/service/ServiceInfo"));
const BioData = lazy(() => import("./components/biodata/BioData"));

const staffFeatures = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Manage your personal and contact details",
    icon: FiUser,
  },
  {
    id: "academic",
    title: "Academic Information",
    description: "Track your academic qualifications and achievements",
    icon: FiBook,
  },
  {
    id: "research",
    title: "Research Activities",
    description: "Manage research publications and projects",
    icon: FiAward,
  },
  {
    id: "employer",
    title: "Employer Details",
    description: "View and update employment information",
    icon: FiBriefcase,
  },
  {
    id: "service",
    title: "Service Details",
    description: "Track your service history and records",
    icon: FiClock,
  },
  {
    id: "biodata",
    title: "Biodata Generation",
    description: "Generate and manage your professional biodata",
    icon: FiFileText,
  },
];

export default function StaffInfoFeature() {
  const { currentSection } = useNavigation();

  const renderContent = () => {
    switch (currentSection) {
      case "personal":
        return (
          <Suspense fallback={<div>Loading personal information...</div>}>
            <PersonalInfo />
          </Suspense>
        );
      case "academic":
        return (
          <Suspense fallback={<div>Loading academic information...</div>}>
            <AcademicInfo />
          </Suspense>
        );
      case "research":
        return (
          <Suspense fallback={<div>Loading research information...</div>}>
            <ResearchInfo />
          </Suspense>
        );
      case "employer":
        return (
          <Suspense fallback={<div>Loading employer information...</div>}>
            <EmployerInfo />
          </Suspense>
        );
      case "service":
        return (
          <Suspense fallback={<div>Loading service information...</div>}>
            <ServiceInfo />
          </Suspense>
        );
      case "biodata":
        return (
          <Suspense fallback={<div>Loading biodata generator...</div>}>
            <BioData />
          </Suspense>
        );
      default:
        return (
          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-highlight)]">
                  Staff Information
                </h2>
                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Manage your professional profile and academic records
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffFeatures.map((feature) => (
                  <DashboardCard
                    key={feature.id}
                    id={feature.id}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                ))}
              </div>
            </div>
          </Card>
        );
    }
  };

  return <PageContainer>{renderContent()}</PageContainer>;
}
