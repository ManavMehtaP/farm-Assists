import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'home': 'Home',
    'weather': 'Weather',
    'crops': 'Crops',
    'disease': 'Disease',
    'market': 'Market',
    'schemes': 'Schemes',
    'chat': 'Chat',
    'language': 'Language',
    // Home Screen
    'welcome': 'Welcome',
    'appTitle': 'Your Farming Assistant',
    'appSubtitle': 'All information for smart farming',
    'location': 'Gujarat, India',
    'todaysWeather': "Today's Weather",
    'viewDetails': 'View Details',
    'quickServices': 'Quick Services',
    'cropAdvice': 'Crop Advice',
    'cropAdviceDesc': 'Get the best crops based on soil and weather',
    'diseaseDetection': 'Disease Detection',
    'diseaseDetectionDesc': 'Check for diseases by taking a photo of leaves',
    'marketPrices': 'Market Prices',
    'marketPricesDesc': 'Check today\'s fresh market prices',
    'govtSchemes': 'Government Schemes',
    'govtSchemesDesc': 'Information about government schemes for farmers',
    'comingSoon': 'Coming Soon',
    'chatAssistant': 'Chat Assistant',
    'offlineMode': 'Offline Mode',
    'voiceAssistant': 'Voice Assistant',
    'voiceAssistantPrompt': 'Have a question? Click the mic button below',
    'startChat': 'Start Chat',
    'dailyTip': "Today's Tip",
    'dailyTipContent': 'The weather is clear, a good time to water the fields. Check soil moisture levels.',
    'yourArea': 'Your Area',
    'weatherForecast': 'Weather Forecast',
    'ahmedabadGujarat': 'Ahmedabad, Gujarat',
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'dayAfterTomorrow': 'Day after',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun',
    'monday': 'Mon',
    'sunny': 'Sunny',
    'cloudy': 'Cloudy',
    'rainy': 'Rainy',
    'feelsLike': 'Feels like {temp}',
    'confidence': 'Confidence',
    'maxTemp': 'Max',
    'minTemp': 'Min',
    'detailedInfo': 'Detailed Information',
    'humidity': 'Humidity',
    'wind': 'Wind',
    'visibility': 'Visibility',
    'pressure': 'Pressure',
    'weeklyForecast': '7-Day Forecast',
    'rain': 'Rain: {rain}',
    'farmingAdvice': 'Farming Advice',
    'weatherFarmingAdvice': 'The weather is clear and the temperature is good. This is a good time for irrigation. There is a chance of rain in the next two days, so it is a good time to apply fertilizer.',
    // Error Pages
    'pageNotFound': 'Oops! Page not found',
    'returnToHome': 'Return to Home',
    // Units
    'celsius': 'C',
    'fahrenheit': 'F',
    'percentage': '%',
    'kilometer': 'km',
    'kilometerPerHour': 'km/h',
    'millibar': 'mb',
  },
  hi: {
    // Navigation
    'home': 'होम',
    'weather': 'मौसम',
    'crops': 'फसलें',
    'disease': 'रोग',
    'market': 'बाजार',
    'schemes': 'योजनाएं',
    'chat': 'चैट',
    'language': 'भाषा',
    // Home Screen
    'welcome': 'आपका स्वागत है',
    'appTitle': 'आपका खेती सहायक',
    'appSubtitle': 'स्मार्ट खेती के लिए सभी जानकारी',
    'location': 'गुजरात, भारत',
    'todaysWeather': 'आज का मौसम',
    'viewDetails': 'विस्तार देखें',
    'quickServices': 'तुरंत सेवा',
    'cropAdvice': 'फसल सलाह',
    'cropAdviceDesc': 'मिट्टी और मौसम के आधार पर सबसे अच्छी फसल जानें',
    'diseaseDetection': 'रोग पहचान',
    'diseaseDetectionDesc': 'पत्ती की तस्वीर लेकर रोग की जांच करें',
    'marketPrices': 'मंडी भाव',
    'marketPricesDesc': 'आज के ताजा मंडी भाव देखें',
    'govtSchemes': 'सरकारी योजना',
    'govtSchemesDesc': 'किसानों के लिए सरकारी योजनाओं की जानकारी',
    'comingSoon': 'जल्द आ रहा है',
    'chatAssistant': 'चैट सहायक',
    'offlineMode': 'ऑफलाइन मोड',
    'voiceAssistant': 'आवाज़ सहायक',
    'voiceAssistantPrompt': 'कुछ पूछना चाहते हैं? नीचे माइक बटन दबाएं',
    'startChat': 'चैट शुरू करें',
    'dailyTip': 'आज की सलाह',
    'dailyTipContent': 'मौसम साफ है, खेत में पानी देने का अच्छा समय है। मिट्टी की नमी जांचें।',
    'yourArea': 'आपका क्षेत्र',
    'weatherForecast': 'मौसम पूर्वानुमान',
    'ahmedabadGujarat': 'अहमदाबाद, गुजरात',
    'today': 'आज',
    'tomorrow': 'कल',
    'dayAfterTomorrow': 'परसों',
    'friday': 'शुक्र',
    'saturday': 'शनि',
    'sunday': 'रवि',
    'monday': 'सोम',
    'sunny': 'धूप',
    'cloudy': 'बादल',
    'rainy': 'बारिश',
    'feelsLike': 'महसूस हो रहा है {temp} जैसे',
    'confidence': 'भरोसा',
    'maxTemp': 'अधिकतम',
    'minTemp': 'न्यूनतम',
    'detailedInfo': 'विस्तृत जानकारी',
    'humidity': 'नमी',
    'wind': 'हवा',
    'visibility': 'दृश्यता',
    'pressure': 'दबाव',
    'weeklyForecast': '7 दिन का पूर्वानुमान',
    'rain': 'बारिश: {rain}',
    'farmingAdvice': 'खेती की सलाह',
    'weatherFarmingAdvice': 'मौसम साफ है और तापमान अच्छा है। यह समय सिंचाई के लिए उपयुक्त है। अगले दो दिन में बारिश की संभावना है, इसलिए खाद डालने का अच्छा समय है।',
    // Error Pages
    'pageNotFound': 'उफ़! पेज नहीं मिला',
    'returnToHome': 'होम पर वापस जाएं',
    // Units
    'celsius': '°से',
    'fahrenheit': '°फे',
    'percentage': '%',
    'kilometer': 'किमी',
    'kilometerPerHour': 'किमी/घंटा',
    'millibar': 'एमबी',
  },
  gu: {
    // Navigation
    'home': 'હોમ',
    'weather': 'હવામાન',
    'crops': 'પાક',
    'disease': 'રોગ',
    'market': 'બજાર',
    'schemes': 'યોજનાઓ',
    'chat': 'ચેટ',
    'language': 'ભાષા',
    // Home Screen
    'welcome': 'સ્વાગત છે',
    'appTitle': 'તમારો ખેતી સહાયક',
    'appSubtitle': 'સ્માર્ટ ખેતી માટેની બધી માહિતી',
    'location': 'ગુજરાત, ભારત',
    'todaysWeather': 'આજનું હવામાન',
    'viewDetails': 'વિગતો જુઓ',
    'quickServices': 'ઝડપી સેવાઓ',
    'cropAdvice': 'પાક સલાહ',
    'cropAdviceDesc': 'માટી અને હવામાનના આધારે શ્રેષ્ઠ પાક મેળવો',
    'diseaseDetection': 'રોગ શોધ',
    'diseaseDetectionDesc': 'પાંદડાની ફોટો લઈને રોગ તપાસો',
    'marketPrices': 'બજાર ભાવ',
    'marketPricesDesc': 'આજના તાજા બજાર ભાવ તપાસો',
    'govtSchemes': 'સરકારી યોજનાઓ',
    'govtSchemesDesc': 'ખેડૂતો માટે સરકારી યોજનાઓની માહિતી',
    'comingSoon': 'જલ્દી આવી રહ્યું છે',
    'chatAssistant': 'ચેટ સહાયક',
    'offlineMode': 'ઑફલાઇન મોડ',
    'voiceAssistant': 'વૉઇસ સહાયક',
    'voiceAssistantPrompt': 'કોઈ પ્રશ્ન છે? નીચેના માઇક બટન પર ક્લિક કરો',
    'startChat': 'ચેટ શરૂ કરો',
    'dailyTip': 'આજની ટિપ્પણી',
    'dailyTipContent': 'હવામાન સ્વચ્છ છે, ખેતરમાં પાણી આપવા માટે સારો સમય છે. માટીની ભેજ તપાસો.',
    'yourArea': 'તમારું વિસ્તાર',
    'weatherForecast': 'હવામાન અંદાજ',
    'ahmedabadGujarat': 'અમદાવાદ, ગુજરાત',
    'today': 'આજે',
    'tomorrow': 'કાલે',
    'dayAfterTomorrow': 'પરમ દિવસે',
    'friday': 'શુક્ર',
    'saturday': 'શનિ',
    'sunday': 'રવિ',
    'monday': 'સોમ',
    'sunny': 'સૂર્ય',
    'cloudy': 'વાદળછાયું',
    'rainy': 'વરસાદ',
    'feelsLike': 'અનુભવ {temp} જેવું લાગે છે',
    'confidence': 'વિશ્વાસ',
    'maxTemp': 'મહત્તમ',
    'minTemp': 'ન્યૂનતમ',
    'detailedInfo': 'વિસ્તૃત માહિતી',
    'humidity': 'ભેજ',
    'wind': 'પવન',
    'visibility': 'દૃષ્ટિ',
    'pressure': 'દબાણ',
    'weeklyForecast': '7 દિવસનો અંદાજ',
    'rain': 'વરસાદ: {rain}',
    'farmingAdvice': 'ખેતી સલાહ',
    'weatherFarmingAdvice': 'હવામાન સ્વચ્છ છે અને તાપમાન સારું છે. આ સિંચાઈ માટે યોગ્ય સમય છે. આગામી બે દિવસમાં વરસાદની સંભાવના છે, તેથી ખાતર નાખવા માટે સારો સમય છે.',
    // Error Pages
    'pageNotFound': 'ઓહ! પેજ મળ્યું નથી',
    'returnToHome': 'હોમ પર પાછા જાઓ',
    // Units
    'celsius': '°સે',
    'fahrenheit': '°ફે',
    'percentage': '%',
    'kilometer': 'કિ.મી.',
    'kilometerPerHour': 'કિ.મી./કલાક',
    'millibar': 'એમબાર',
  }
} as const;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('hi'); // Default to Hindi

  // Load saved language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi' || savedLanguage === 'gu')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations[Language]] || key;

    // Replace placeholders with provided parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Available languages with their display names
export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];
