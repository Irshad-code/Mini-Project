import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-primary)]">
      {/* Fixed Header - highest z-index */}
      <div className="relative z-[1000]">
        <Header
          onMobileMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
          isMobileNavOpen={isMobileNavOpen}
        />
      </div>

      {/* Sidebar - lower z-index than header */}
      <div className="relative z-[999]">
        <Sidebar
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      </div>

      {/* Main Content - lowest z-index */}
      <div className="pt-16 lg:ml-64 relative z-0">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
