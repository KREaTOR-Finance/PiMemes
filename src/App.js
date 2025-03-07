import { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "./components/BottomNav";
import WelcomeScreen from "./screens/WelcomeScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === "true") {
        setShowWelcome(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking first launch:", error);
      setIsLoading(false);
    }
  };

  const handleWelcomeComplete = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
      setShowWelcome(false);
    } catch (error) {
      console.error("Error saving launch state:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111111' }}>
        <StatusBar barStyle="light-content" backgroundColor="#111111" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111111' }}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      {showWelcome ? (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      ) : (
        <BottomNav />
      )}
    </View>
  );
} 