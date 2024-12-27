import { useNavigation } from '../../contexts/NavigationContext';
import Card from '../ui/Card';

export default function DashboardCard({ id, title, description, icon: Icon }) {
  const { setCurrentSection } = useNavigation();

  const handleCardClick = () => {
    setCurrentSection(id);
  };

  return (
    <Card className="cursor-pointer hover:scale-105 transition-transform duration-300">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
          <Icon className="w-6 h-6 text-[var(--color-accent-teal)]" />
        </div>
        <div onClick={handleCardClick}>
          <h3 className="text-lg font-medium text-[var(--color-accent-teal)]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
