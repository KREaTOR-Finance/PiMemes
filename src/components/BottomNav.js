import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SwapScreen from "../screens/SwapScreen";
import LiquidityScreen from "../screens/LiquidityScreen";
import FarmingScreen from "../screens/FarmingScreen";
import ChartsScreen from "../screens/ChartsScreen";
import TokensScreen from "../screens/TokensScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { 
  HomeIcon, 
  ArrowsRightLeftIcon, 
  BeakerIcon,
  ChartBarIcon,
  ListBulletIcon
} from "@heroicons/react/24/outline";

const Tab = createBottomTabNavigator();

const TabIcon = ({ Icon, focused }) => (
  <View style={{ 
    padding: 8,
    backgroundColor: focused ? '#FFD700' : 'transparent',
    borderRadius: 12
  }}>
    <Icon 
      size={24} 
      color={focused ? '#000000' : '#FFD700'} 
      style={{ opacity: focused ? 1 : 0.7 }}
    />
  </View>
);

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{ 
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#1a1a1a',
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            height: 60
          },
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#FFD700',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -4,
            marginBottom: 4
          }
        }}
      >
        <Tab.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ 
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' }
          }} 
        />
        
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={HomeIcon} focused={focused} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Swap" 
          component={SwapScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={ArrowsRightLeftIcon} focused={focused} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Liquidity" 
          component={LiquidityScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={BeakerIcon} focused={focused} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Charts" 
          component={ChartsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={ChartBarIcon} focused={focused} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Tokens" 
          component={TokensScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon Icon={ListBulletIcon} focused={focused} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 