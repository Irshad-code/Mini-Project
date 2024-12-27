import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext(undefined);

export function NavigationProvider({ children }) {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [previousSection, setPreviousSection] = useState(null);

  const handleSectionChange = (newSection) => {
    setPreviousSection(currentSection);
    setCurrentSection(newSection);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentSection,
        setCurrentSection: handleSectionChange,
        previousSection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
