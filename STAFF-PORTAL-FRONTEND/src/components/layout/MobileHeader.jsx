import { FiMenu } from 'react-icons/fi';
import { useNavigation } from '../../contexts/NavigationContext';
import { navigation } from './navigation/NavigationConfig';

export default function MobileHeader() {
  const { setCurrentSection } = useNavigation();

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        <h1 className="text-xl font-bold gradient-text">EmpPortal</h1>

        <div className="relative group">
          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-teal)]">
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-primary)] rounded-md shadow-lg border border-[var(--color-border-primary)] hidden group-hover:block">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentSection(item.section)}
                className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary-500)]"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
