import { lazy, Suspense } from "react";
import { useNavigation } from "../contexts/NavigationContext";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import FeaturePlaceholder from "../components/placeholder/FeaturePlaceholder";

const StaffInfoFeature = lazy(() =>
  import("../features/staffInfo/StaffInfoFeature")
);
const MyClasses = lazy(() => import("../features/classes/MyClasses"));
const TaxManagementFeature = lazy(() =>
  import("../features/taxManagement/TaxManagementFeature")
);

export default function Dashboard() {
  const { currentSection } = useNavigation();

  // Helper function to determine if we're in a staff info section
  const isStaffInfoSection = () =>
    currentSection === "staff-info" ||
    [
      "personal",
      "academic",
      "research",
      "employer",
      "service",
      "biodata",
    ].includes(currentSection);

  // Helper function to determine if we're in a tax section
  const isTaxSection = () =>
    currentSection === "tax" ||
    ["calculator", "declarations", "documents", "history"].includes(
      currentSection
    );

  // Determine which feature to show
  const getFeatureComponent = () => {
    if (isStaffInfoSection()) {
      return <StaffInfoFeature />;
    }
    if (currentSection === "my-classes") {
      return <MyClasses />;
    }
    if (isTaxSection()) {
      return <TaxManagementFeature />;
    }
    if (currentSection === "leave") {
      return <FeaturePlaceholder title="Leave Management" />;
    }
    if (currentSection === "payroll") {
      return <FeaturePlaceholder title="Payroll" />;
    }
    return <DashboardGrid />;
  };

  return (
    <PageContainer>
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          {getFeatureComponent()}
        </Suspense>
      </div>
    </PageContainer>
  );
}
