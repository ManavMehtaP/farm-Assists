import { Button } from "@/components/ui/button";
import { 
  Home, 
  Cloud, 
  Sprout, 
  Camera, 
  TrendingUp, 
  FileText, 
  MessageCircle,
  Wifi 
} from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { t } = useLanguage();

  const navItems = [
    { id: "home", icon: Home, label: t('home') },
    { id: "weather", icon: Cloud, label: t('weather') },
    { id: "crops", icon: Sprout, label: t('cropAdvice') },
    { id: "disease", icon: Camera, label: t('diseaseDetection') },
    { id: "market", icon: TrendingUp, label: t('marketPrices') },
    { id: "schemes", icon: FileText, label: t('govtSchemes') },
    { id: "chat", icon: MessageCircle, label: t('chatAssistant') },
    { id: "offline", icon: Wifi, label: t('offlineMode') },
  ];

  return (
    <div className="bg-gradient-earth border-b border-border/50 shadow-earth">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('appTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('welcome')}</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 px-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-medium
                ${activeTab === item.id
                  ? "bg-gradient-farming text-primary-foreground shadow-natural"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};