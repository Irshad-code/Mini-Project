import { useState } from 'react';
import { FiBell, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header({ onMobileMenuToggle, isMobileNavOpen }) {
  const [notifications] = useState(3);

  return (
    <header className="fixed w-full bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)]">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-white-opacity)]"
          >
            {isMobileNavOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>

          <h1 className="text-2xl font-bold gradient-text">EmpPortal</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-teal)] transition-colors">
            <FiBell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 bg-[var(--color-accent-teal)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-full hover:bg-[var(--color-bg-white-opacity)]">
              <FiUser className="w-6 h-6 text-[var(--color-text-secondary)]" />
            </Menu.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right glass-effect rounded-md shadow-lg focus:outline-none">
                <div className="py-1">
                  {['Profile', 'Settings', 'Sign out'].map((item) => (
                    <Menu.Item key={item}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={clsx(
                            active ? 'bg-[var(--color-bg-white-opacity)]' : '',
                            'block px-4 py-2 text-sm text-[var(--color-text-primary)]'
                          )}
                        >
                          {item}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
