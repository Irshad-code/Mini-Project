import { createContext, useContext, useState, useCallback } from 'react';

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [lastUpdate, setLastUpdate] = useState(new Date().getTime());

  const refreshPhoto = useCallback(() => {
    setLastUpdate(new Date().getTime());
  }, []);

  return (
    <PhotoContext.Provider value={{ lastUpdate, refreshPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhoto must be used within a PhotoProvider');
  }
  return context;
}
