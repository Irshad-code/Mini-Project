import { getNavigationItems } from "../layout/navigation/NavigationConfig";
import DashboardCard from "./DashboardCard";
import Card from "../ui/Card";
import { useUser } from "../../contexts/UserContext";

export default function DashboardGrid() {
  const { user } = useUser();
  const dashboardFeatures = getNavigationItems('dashboard', user?.role);

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="bg-[var(--color-bg-primary)] shadow-lg p-8 rounded-xl w-full border border-[var(--color-border-primary)]">
        <h1 className="text-2xl font-bold text-[var(--color-primary-500)] mb-2">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-8">
          {user?.role === 'SUPER_USER' 
            ? "Here's an overview of all system features and administrative tools."
            : "Here's an overview of your academic activities and information."}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardFeatures.map((feature) => (
            <DashboardCard
              key={feature.section}
              id={feature.section}
              title={feature.name}
              description={feature.description || ""}
              icon={feature.icon}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
