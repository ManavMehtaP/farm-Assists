import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WeatherScreen } from "@/components/screens/WeatherScreen";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { t } = useLanguage();

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigate={setActiveTab} />;
      case "weather":
        return <WeatherScreen />;
      case "crops":
        return <div className="p-4 text-center text-muted-foreground">{t('cropAdvice')} - {t('comingSoon')}</div>;
      case "disease":
        return <div className="p-4 text-center text-muted-foreground">{t('diseaseDetection')} - {t('comingSoon')}</div>;
      case "market":
        return <div className="p-4 text-center text-muted-foreground">{t('marketPrices')} - {t('comingSoon')}</div>;
      case "schemes":
        return <div className="p-4 text-center text-muted-foreground">{t('govtSchemes')} - {t('comingSoon')}</div>;
      case "chat":
        return <div className="p-4 text-center text-muted-foreground">{t('chatAssistant')} - {t('comingSoon')}</div>;
      case "offline":
        return <div className="p-4 text-center text-muted-foreground">{t('offlineMode')} - {t('comingSoon')}</div>;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-4">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Index;
