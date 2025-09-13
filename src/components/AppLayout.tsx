import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { LocationSelector } from './LocationSelector';

// Create the context
type LocationContextType = {
  location: { state: string; city: string } | null;
  setLocation: (location: { state: string; city: string } | null) => void;
};

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const AppLayout = () => {
  const [location, setLocationState] = useState<{ state: string; city: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved location from localStorage on mount
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const parsed = JSON.parse(savedLocation);
        console.log('Loaded saved location:', parsed);
        setLocationState(parsed);
      } else {
        // Set default location if none saved
        const defaultLocation = { state: 'Gujarat', city: 'Ahmedabad' };
        console.log('Setting default location:', defaultLocation);
        setLocationState(defaultLocation);
        localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
      }
    } catch (error) {
      console.error('Error loading location:', error);
      // Set default location on error
      const defaultLocation = { state: 'Gujarat', city: 'Ahmedabad' };
      setLocationState(defaultLocation);
      localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocation = (newLocation: { state: string; city: string } | null) => {
    console.log('Setting new location:', newLocation);
    setLocationState(newLocation);
    if (newLocation) {
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
    } else {
      localStorage.removeItem('userLocation');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      <div className="relative min-h-screen">
        <Outlet />
        <LocationSelector
          onLocationSelect={(state, city) => setLocation({ state, city })}
          currentLocation={location || undefined}
        />
      </div>
    </LocationContext.Provider>
  );
};
