import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-[var(--color-bg-white-opacity)]"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5 text-[var(--color-text-secondary)]" />
      ) : (
        <FiSun className="w-5 h-5 text-[var(--color-text-secondary)]" />
      )}
    </button>
  );
}
