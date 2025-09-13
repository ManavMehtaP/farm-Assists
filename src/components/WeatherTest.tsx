import { useState } from 'react';
import { testWeatherAPI, fetchCurrentWeather } from '@/services/weatherService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// City coordinates mapping
const CITIES = {
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Shimla': { lat: 31.1048, lon: 77.1734 }, // Added Shimla
  'Surat': { lat: 21.1702, lon: 72.8311 },
};

type CityName = keyof typeof CITIES;

export const WeatherTest = () => {
  const [selectedCity, setSelectedCity] = useState<CityName>('Shimla');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    loading: boolean;
  }>({ success: false, message: '', loading: false });
  const [customCoords, setCustomCoords] = useState({ lat: '31.1048', lon: '77.1734' });
  const [useCustomCoords, setUseCustomCoords] = useState(false);

  const runTest = async () => {
    setTestResult(prev => ({ ...prev, loading: true }));

    try {
      let result;
      if (useCustomCoords) {
        const lat = parseFloat(customCoords.lat);
        const lon = parseFloat(customCoords.lon);
        if (isNaN(lat) || isNaN(lon)) {
          throw new Error('Invalid coordinates');
        }
        const data = await fetchCurrentWeather(lat, lon);
        result = {
          success: true,
          message: `Weather in ${data.name || 'the specified location'}: ${data.weather[0]?.description}, ${Math.round(data.main.temp)}°C`
        };
      } else {
        const cityData = CITIES[selectedCity];
        const data = await fetchCurrentWeather(cityData.lat, cityData.lon);
        result = {
          success: true,
          message: `Weather in ${selectedCity}: ${data.weather[0]?.description}, ${Math.round(data.main.temp)}°C`
        };
      }

      setTestResult({
        success: true,
        message: result.message,
        loading: false
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loading: false
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Weather API Test</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="city-select" className="block text-sm font-medium mb-1">
            Select a city:
          </Label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as CityName)}
            disabled={useCustomCoords}
            className="w-full p-2 border rounded-md"
          >
            {Object.keys(CITIES).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="use-custom"
            checked={useCustomCoords}
            onChange={(e) => setUseCustomCoords(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="use-custom">Use custom coordinates</Label>
        </div>

        {useCustomCoords && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat" className="block text-sm font-medium mb-1">
                Latitude:
              </Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                value={customCoords.lat}
                onChange={(e) => setCustomCoords(prev => ({ ...prev, lat: e.target.value }))}
                placeholder="e.g., 31.1048"
              />
            </div>
            <div>
              <Label htmlFor="lon" className="block text-sm font-medium mb-1">
                Longitude:
              </Label>
              <Input
                id="lon"
                type="number"
                step="0.0001"
                value={customCoords.lon}
                onChange={(e) => setCustomCoords(prev => ({ ...prev, lon: e.target.value }))}
                placeholder="e.g., 77.1734"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={runTest}
            disabled={testResult.loading}
            className="w-full"
          >
            {testResult.loading ? 'Fetching...' : 'Get Weather'}
          </Button>
        </div>

        {testResult.message && (
          <div className={`p-4 rounded-md ${
            testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h3 className="font-medium">
              {testResult.success ? '✅ Weather Data' : '❌ Error'}
            </h3>
            <p className="text-sm mt-1">{testResult.message}</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <h4 className="font-medium mb-2">Troubleshooting:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check browser console (F12) for detailed logs</li>
            <li>Verify API key in .env file</li>
            <li>Check internet connection</li>
            <li>Ensure API key has access to OpenWeatherMap</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeatherTest;
