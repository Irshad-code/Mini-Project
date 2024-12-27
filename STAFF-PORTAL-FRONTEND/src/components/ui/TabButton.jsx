import { Tab } from '@headlessui/react';
import clsx from 'clsx';

export default function TabButton({ index, name }) {
  return (
    <Tab
      className={({ selected }) =>
        clsx(
          'px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-all duration-200',
          selected
            ? 'bg-[var(--color-bg-primary)] text-[var(--color-accent-teal)] border-t border-x border-[var(--color-border-primary)] border-b-[var(--color-bg-primary)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer'
        )
      }
    >
      <span className="flex items-center">
        <span className="w-6 h-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mr-2">
          {index + 1}
        </span>
        {name}
      </span>
    </Tab>
  );
}
