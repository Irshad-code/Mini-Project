import { dashboardFeatures } from './dashboardData';
import DashboardCard from './DashboardCard';

export default function DashboardGrid() {
  return (
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
  );
}
