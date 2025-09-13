import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";

// Indian states and their major cities
const indianLocations = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Tawang', 'Pasighat', 'Namsai'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Arrah'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Raigarh', 'Durg'],
  'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
  'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Kullu', 'Manali'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Nongpoh'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri'],
  'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Pathankot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Geyzing', 'Rangpo'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Pratapgarh', 'Kailasahar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Prayagraj'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman']
};

interface LocationSelectorProps {
  onLocationSelect: (state: string, city: string) => void;
  currentLocation?: { state: string; city: string };
}

export const LocationSelector = ({ onLocationSelect, currentLocation }: LocationSelectorProps) => {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState(currentLocation?.state || '');
  const [selectedCity, setSelectedCity] = useState(currentLocation?.city || '');
  const [showPopup, setShowPopup] = useState(!currentLocation);

  const states = Object.keys(indianLocations).sort();
  const cities = selectedState ? (indianLocations[selectedState as keyof typeof indianLocations] || []) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedState && selectedCity) {
      onLocationSelect(selectedState, selectedCity);
      setShowPopup(false);
      // Save to localStorage
      localStorage.setItem('userLocation', JSON.stringify({ state: selectedState, city: selectedCity }));
    }
  };

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const { state, city } = JSON.parse(savedLocation);
      if (state && city) {
        setSelectedState(state);
        setSelectedCity(city);
      }
    }
  }, []);

  if (!showPopup) {
    return (
      <Button
        variant="outline"
        className="fixed bottom-6 right-6 z-50 bg-background/80 backdrop-blur-sm flex items-center gap-2"
        onClick={() => setShowPopup(true)}
      >
        <MapPin className="h-4 w-4" />
        {currentLocation ? `${currentLocation.city}, ${currentLocation.state}` : t('selectLocation')}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-background/95">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t('selectYourLocation') || 'Select Your Location'}</CardTitle>
              <CardDescription>
                {t('locationHelpText') || 'Choose your state and city to get accurate weather and farming information.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="state">
                {t('state') || 'State'}
              </label>
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedCity('');
                }}
                required
              >
                <SelectTrigger id="state" className="w-full">
                  <SelectValue placeholder={t('selectState') || 'Select a state'} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="city">
                {t('city') || 'City'}
              </label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={!selectedState}
                required
              >
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder={selectedState ? (t('selectCity') || 'Select a city') : (t('selectStateFirst') || 'Select a state first')} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentLocation) {
                  setShowPopup(false);
                } else {
                  // Use default location if no location is set yet
                  onLocationSelect('Gujarat', 'Ahmedabad');
                  setShowPopup(false);
                }
              }}
            >
              {currentLocation ? t('cancel') : t('useDefaultLocation')}
            </Button>
            <Button type="submit" disabled={!selectedState || !selectedCity}>
              {t('saveLocation') || 'Save Location'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
