import { IconType } from 'react-icons';
import clsx from 'clsx';

export default function NavigationItem({
  name,
  icon: Icon,
  isActive,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 w-full',
        isActive
          ? 'bg-[var(--color-primary-500)] text-[var(--color-text-light)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary-500)]'
      )}
    >
      <Icon
        className={clsx(
          'h-5 w-5 flex-shrink-0 transition-colors duration-300 mr-3',
          isActive
            ? 'text-[var(--color-text-light)]'
            : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary-500)]'
        )}
      />
      <span>{name}</span>
    </button>
  );
}
