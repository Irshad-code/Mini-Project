import { useState } from 'react';
import { FiBell, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import ThemeToggle from '../ui/ThemeToggle';
import { useUser } from '../../contexts/UserContext';
import { useProfilePhoto } from '../../features/staffInfo/hooks/useProfilePhoto';
import { usePhoto } from '../../contexts/PhotoContext';

export default function Header({ onMobileMenuToggle, isMobileNavOpen }) {
  const [notifications] = useState(3);
  const { user, signout } = useUser();
  const { photoUrl } = useProfilePhoto(user?.userId);
  const { lastUpdate } = usePhoto();

  const menuItems = [
    { label: 'Profile', onClick: () => console.log('Profile clicked') },
    { label: 'Settings', onClick: () => console.log('Settings clicked') },
    { label: 'Sign out', onClick: signout },
  ];

  // Add timestamp to photo URL to prevent caching
  const photoUrlWithTimestamp = photoUrl ? `${photoUrl}?t=${lastUpdate}` : null;

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
            <Menu.Button className="flex items-center space-x-2 p-1 rounded-full hover:bg-[var(--color-bg-white-opacity)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
              {photoUrlWithTimestamp ? (
                <img 
                  src={photoUrlWithTimestamp}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-[var(--color-border-primary)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </div>
              )}
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
                  {/* User Info Section */}
                  <div className="px-4 py-2 border-b border-[var(--color-border-primary)]">
                    <div className="flex items-center space-x-3">
                      {photoUrlWithTimestamp ? (
                        <img 
                          src={photoUrlWithTimestamp}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-[var(--color-border-primary)]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-[var(--color-text-secondary)]" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                          {user?.name || 'User'}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {user?.email || ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  {menuItems.map((item) => (
                    <Menu.Item key={item.label}>
                      {({ active }) => (
                        <button
                          onClick={item.onClick}
                          className={clsx(
                            active ? 'bg-[var(--color-bg-white-opacity)]' : '',
                            'block w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)]'
                          )}
                        >
                          {item.label}
                        </button>
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
