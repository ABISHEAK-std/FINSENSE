import React, { useState, useEffect } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import ICPAuthButton from "./ICPAuthButton"; // 👈 add
import { useICP } from "../../ic/useICP";

const EmotionalHeader = ({
  emotionalState = "calm",
  culturalContext = "default",
  onVoiceToggle,
  onCrisisHelp,
  className = "",
}) => {
  const { authed, login, logout } = useICP();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(
    "/emotional-financial-dashboard"
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    {
      path: "/emotional-financial-dashboard",
      label: "Dashboard",
      icon: "BarChart3",
      description: "Financial overview with emotional insights",
    },
    {
      path: "/expense-tracking-emotional-analysis",
      label: "Expenses",
      icon: "Receipt",
      description: "Track spending with emotional analysis",
    },
    {
      path: "/ai-financial-therapy-chat",
      label: "Therapy",
      icon: "MessageCircleHeart",
      description: "AI-powered financial counseling",
    },
    {
      path: "/cultural-financial-planning",
      label: "Culture",
      icon: "Users",
      description: "Traditional financial planning",
    },
    {
      path: "/investment-portfolio-emotional-market-timing",
      label: "Investments",
      icon: "TrendingUp",
      description: "Portfolio with emotional market timing",
    },
    {
    path: "/tokens",
    label: "Tokens",
    icon: "CircleDollarSign",
    description: "Earn & redeem FinCoins",
  },
  
  ];

  const handleVoiceToggle = () => {
    const next = !isVoiceActive;
    setIsVoiceActive(next);
    onVoiceToggle?.(next);
  };

  const handleNavigation = (path) => {
    setActiveNavItem(path);
    window.location.href = path;
  };

  const getEmotionalStateColor = () => {
    switch (emotionalState) {
      case "stressed":
        return "text-warning";
      case "positive":
        return "text-success";
      case "calm":
      default:
        return "text-primary";
    }
  };

  const getEmotionalStateIcon = () => {
    switch (emotionalState) {
      case "stressed":
        return "AlertTriangle";
      case "positive":
        return "Smile";
      case "calm":
      default:
        return "Heart";
    }
  };

  const getCulturalGreeting = () => {
    const hour = currentTime.getHours();
    if (
      culturalContext ===
      "hindi theriyathu poda pundaaa"
    ) {
      if (hour < 12) return "hmam ke raincoat";
      if (hour < 17) return "flipp";
      return "शुभ संध्या";
    }
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-card border-b transition-emotional ${className}`}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              {/* Logo fills the gradient box */}
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-lg overflow-hidden">
                <img
                  src="/assets/images/FINSENCE-LOGO.jpg"
                  alt="Finsence Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getEmotionalStateColor()} bg-current animate-pulse`}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading text-foreground">
                <b>
                  <b>FinSence</b>
                </b>
              </h1>
              <p className="text-sm text-muted-foreground">
                {getCulturalGreeting()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={activeNavItem === item.path ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-ui"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Emotional State Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-muted/50">
            <Icon
              name={getEmotionalStateIcon()}
              size={16}
              className={getEmotionalStateColor()}
            />
            <span className="text-sm font-medium capitalize text-muted-foreground">
              {emotionalState}
            </span>
          </div>

          {/* Voice Assistant Toggle */}
          <Button
            variant={isVoiceActive ? "default" : "outline"}
            size="sm"
            onClick={handleVoiceToggle}
            iconName="Mic"
            iconSize={16}
            className={`transition-ui ${isVoiceActive ? "voice-active" : ""}`}
          >
            <span className="hidden sm:inline ml-2">Voice</span>
          </Button>

          {/* Crisis Help Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onCrisisHelp}
            iconName="LifeBuoy"
            iconSize={16}
            className="text-warning hover:text-warning-foreground hover:bg-warning transition-ui"
          >
            <span className="hidden sm:inline ml-2">Help</span>
          </Button>

          {/* Profile Menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/profile-cultural-preferences")}
            iconName="User"
            iconSize={16}
            className="transition-ui"
          >
            <span className="hidden sm:inline ml-2">Profile</span>
          </Button>

          {/* ICP Login Button */}
          <ICPAuthButton onLogin={login} onLogout={logout} isAuthenticated={authed} />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            iconName="Menu"
            iconSize={20}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t bg-card/95 backdrop-blur-sm">
        <nav className="flex items-center justify-around py-2 px-4">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex-col h-auto py-2 px-2 transition-ui ${
                activeNavItem === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2 px-2 text-muted-foreground"
            iconName="MoreHorizontal"
          >
            <Icon name="MoreHorizontal" size={18} />
            <span className="text-xs mt-1">More</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default EmotionalHeader;