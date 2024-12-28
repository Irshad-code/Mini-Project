import { dashboardFeatures } from "./dashboardData";
import DashboardCard from "./DashboardCard";
import Card from "../ui/Card";
export default function DashboardGrid() {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="bg-[var(--color-bg-primary)] shadow-lg p-8 rounded-xl w-full border border-[var(--color-border-primary)]">
        <h1 className="text-2xl font-bold text-[var(--color-primary-500)] mb-2">
          Welcome back, John!
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-8">
          Here's an overview of your academic activities, tax declarations, and
          documents.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardFeatures.map((feature) => (
            <DashboardCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
