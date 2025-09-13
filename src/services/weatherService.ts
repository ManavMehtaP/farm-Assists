const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Debug: Log environment variables
console.log('Environment Variables:', {
  VITE_OPENWEATHER_API_KEY: API_KEY ? '***' + API_KEY.slice(-4) : 'Not found',
  NODE_ENV: import.meta.env.MODE,
  BASE_URL: BASE_URL
});

export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop?: number;
  dt_txt?: string;
  name?: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!API_KEY) {
    console.error('OpenWeatherMap API key is not set');
    throw new Error('API key is not configured');
  }

  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log('Making API request to:', url.replace(API_KEY, '***'));

  try {
    const startTime = performance.now();
    const response = await fetch(url);
    const endTime = performance.now();

    console.log(`API request took ${(endTime - startTime).toFixed(2)}ms`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received weather data:', {
      city: data.name,
      temp: data.main?.temp,
      weather: data.weather?.[0]?.description,
      fullData: data
    });

    if (!data || !data.main || !data.weather) {
      console.error('Invalid weather data structure:', data);
      throw new Error('Invalid weather data received from API');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchCurrentWeather:', {
      error,
      url: url.replace(API_KEY, '***'),
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Test function to verify API connectivity
export const testWeatherAPI = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Test with Ahmedabad coordinates
    const testLat = 23.0225;
    const testLon = 72.5714;
    console.log('Testing weather API with Ahmedabad coordinates...');

    const data = await fetchCurrentWeather(testLat, testLon);
    return {
      success: true,
      message: `API is working! Current weather in ${data.name}: ${data.weather[0]?.description}, ${Math.round(data.main.temp)}°C`
    };
  } catch (error) {
    console.error('Weather API test failed:', error);
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const fetchWeatherForecast = async (lat: number, lon: number): Promise<{ list: WeatherData[] }> => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not set');
  }

  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log('Fetching forecast from:', url.replace(API_KEY, '***'));

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Forecast API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchWeatherForecast:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  if (!iconCode) {
    console.warn('No icon code provided, using default icon');
    return 'https://openweathermap.org/img/wn/01d@2x.png';
  }
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
