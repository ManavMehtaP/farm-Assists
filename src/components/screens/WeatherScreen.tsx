import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Loader2,
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  Gauge,
  Eye
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchCurrentWeather, fetchWeatherForecast, getWeatherIconUrl } from "@/services/weatherService";
import { useLocation } from "react-router-dom";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  dt: number;
  pop?: number;
  dt_txt?: string;
}

export const WeatherScreen = () => {
  const { t } = useLanguage();
  const { state } = useLocation();
  const location = state?.location;

  const [weatherData, setWeatherData] = useState<{
    current: WeatherData | null;
    forecast: WeatherData[];
  }>({ current: null, forecast: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch weather data
  const fetchWeather = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      // Use a geocoding service to get lat/lon from city name
      // For now, we'll use a default location if geocoding fails
      let lat = 23.0225; // Default to Ahmedabad
      let lon = 72.5714;

      // In a real app, you would use a geocoding service here
      // Example: const { lat, lon } = await geocodeLocation(location.city, location.state);

      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchWeatherForecast(lat, lon)
      ]);

      setWeatherData({
        current: current,
        forecast: forecast
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(t('weatherFetchError') || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data when location changes
  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-primary" />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-muted-foreground" />;
    } else {
      return <Sun className="h-8 w-8 text-warning" />;
    }
  };

  if (loading && !weatherData.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={fetchWeather}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('retry') || 'Retry'}
        </Button>
      </div>
    );
  }

  const { current } = weatherData;
  const todayForecast = weatherData.forecast[0];

  return (
    <div className="min-h-screen bg-gradient-earth p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold">
              {location ? `${location.city}, ${location.state}` : t('selectLocation')}
            </h1>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                {t('lastUpdated') || 'Last updated'} {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchWeather} disabled={loading}>
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Current Weather */}
      {current && (
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src={getWeatherIconUrl(current.weather[0].icon)}
                  alt={current.weather[0].description}
                  className="h-16 w-16"
                />
                <div>
                  <h2 className="text-4xl font-bold">{Math.round(current.temp)}°C</h2>
                  <p className="capitalize">{current.weather[0].description}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm">
                {t('feelsLike')} {Math.round(current.feels_like)}°C
              </p>
              <p className="text-sm">{t('humidity')}: {current.humidity}%</p>
              <p className="text-sm">{t('wind')}: {current.wind_speed} m/s</p>
            </div>
          </div>
        </Card>
      )}

      {/* Weather Details */}
      {current && (
        <Card className="p-4 bg-white/5 backdrop-blur-sm border-0">
          <h3 className="font-semibold mb-3">{t('weatherDetails') || 'Weather Details'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Droplets className="h-6 w-6 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('humidity')}</div>
                <div className="font-semibold">{current.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Wind className="h-6 w-6 text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">{t('wind')}</div>
                <div className="font-semibold">{current.wind_speed} m/s</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 7-Day Forecast */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t('weeklyForecast') || '7-Day Forecast'}</h2>
        <div className="space-y-2">
          {weatherData.forecast.slice(0, 7).map((day, index) => (
            <Card key={index} className="p-3 bg-white/5 backdrop-blur-sm border-0">
              <div className="flex items-center justify-between">
                <div className="w-24">
                  {index === 0 ? t('today') : new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' })}
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={getWeatherIconUrl(day.weather[0].icon)}
                    alt={day.weather[0].description}
                    className="h-8 w-8"
                  />
                  <span className="w-10 text-right">{Math.round(day.temp)}°</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {day.pop ? `${Math.round(day.pop * 100)}%` : '0%'} {t('chanceOfRain') || 'rain'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};