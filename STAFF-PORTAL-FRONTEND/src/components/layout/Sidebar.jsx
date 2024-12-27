import { FiArrowLeft } from "react-icons/fi";
import { useNavigation } from "../../contexts/NavigationContext";
import NavigationItem from "./navigation/NavigationItem";
import UserProfile from "./navigation/UserProfile";
import {
  getNavigationItems,
  getFeatureTitle,
} from "./navigation/NavigationConfig";
import Button from "../ui/Button";

export default function Sidebar({ isOpen, onClose }) {
  const { currentSection, setCurrentSection } = useNavigation();

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
    [
      "calculator",
      "declarations",
      "documents",
      "history",
    ].includes(currentSection);

  // Determine if we're in a feature section or subsection
  const currentFeature = isStaffInfoSection()
    ? "staff-info"
    : isTaxSection()
    ? "tax"
    : currentSection;

  const isFeatureSection = currentFeature !== "dashboard";
  const navigationItems = getNavigationItems(currentFeature);

  const handleBackToDashboard = () => {
    setCurrentSection("dashboard");
    onClose?.();
  };

  const handleNavigation = (section) => {
    setCurrentSection(section);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50"
          style={{ zIndex: 998 }}
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)] pt-16 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ zIndex: 999 }}
      >
        <UserProfile initials="JD" name="John Doe" role="Faculty Member" />

        {isFeatureSection && (
          <div className="px-4 py-3">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              icon={<FiArrowLeft className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
          </div>
        )}

        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {getFeatureTitle(currentFeature)}
          </h2>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                isActive={currentSection === item.section}
                onClick={() => handleNavigation(item.section)}
              />
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border-primary)]">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="w-full justify-center"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
