import { WeatherCard } from "../WeatherCard";
import { QuickActionCard } from "../QuickActionCard";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Sprout, 
  TrendingUp, 
  FileText, 
  MessageCircle,
  Bell,
  MapPin,
  ChevronDown,
  Loader2
} from "lucide-react";
import farmingHero from "@/assets/farming-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocationContext } from "@/components/AppLayout";
import { useState, useEffect } from "react";
import { LocationSelector } from "@/components/LocationSelector";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { fetchCurrentWeather } from "@/services/weatherService";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

// City to coordinates mapping
const CITY_COORDINATES = {
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Shimla': { lat: 31.1048, lon: 77.1734 },
  'Surat': { lat: 21.1702, lon: 72.8311 },
};

export const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const { t } = useLanguage();
  const { location, setLocation } = useLocationContext();
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        const coords = CITY_COORDINATES[location.city as keyof typeof CITY_COORDINATES] ||
                      { lat: 23.0225, lon: 72.5714 }; // Default to Ahmedabad if city not found

        const data = await fetchCurrentWeather(coords.lat, coords.lon);
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(t('weatherFetchError') || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, t]);

  const quickActions = [
    {
      title: t('cropAdvice'),
      description: t('cropAdviceDesc'),
      icon: Sprout,
      variant: "success" as const,
      action: () => onNavigate("crops")
    },
    {
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDesc'),
      icon: Camera,
      variant: "warning" as const,
      action: () => onNavigate("disease")
    },
    {
      title: t('marketPrices'),
      description: t('marketPricesDesc'),
      icon: TrendingUp,
      variant: "accent" as const,
      action: () => onNavigate("market")
    },
    {
      title: t('govtSchemes'),
      description: t('govtSchemesDesc'),
      icon: FileText,
      variant: "default" as const,
      action: () => onNavigate("schemes")
    }
  ];

  const handleLocationSelect = (state: string, city: string) => {
    const newLocation = { state, city };
    setLocation(newLocation);
    setShowLocationSelector(false);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden rounded-b-2xl">
        <img
          src={farmingHero}
          alt="Farming fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div
            className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowLocationSelector(true)}
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm flex items-center gap-1">
              {location ? `${location.city}, ${location.state}` : t('selectLocation')}
              <ChevronDown className="h-3 w-3" />
            </span>
          </div>
          <h2 className="text-xl font-bold">{t('appTitle')}</h2>
          <p className="text-sm opacity-90">{t('appSubtitle')}</p>
        </div>
        <Button
          variant="sunshine"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => {/* Add notification handler */}}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Weather Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{t('weatherForecast') || 'Weather'}</span>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-4 text-red-500 text-sm">
                {error}
              </div>
            ) : weatherData ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="h-16 w-16"
                  />
                  <div>
                    <div className="text-3xl font-bold">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                    <div className="capitalize">
                      {weatherData.weather[0].description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    {t('feelsLike')} {Math.round(weatherData.main.feels_like)}°C
                  </div>
                  <div className="text-sm">
                    {t('humidity')}: {weatherData.main.humidity}%
                  </div>
                  <div className="text-sm">
                    {t('wind')}: {Math.round(weatherData.wind.speed * 3.6)} km/h
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {t('selectLocationToSeeWeather') || 'Select a location to see weather'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold mt-6 mb-2">
          {t('quickActions') || 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              variant={action.variant}
              onClick={action.action}
            />
          ))}
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('selectLocation') || 'Select Location'}
            </h3>
            <LocationSelector
              onLocationSelect={handleLocationSelect}
              currentLocation={location}
            />
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowLocationSelector(false)}
            >
              {t('cancel') || 'Cancel'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};