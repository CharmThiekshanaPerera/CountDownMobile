import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Animated } from 'react-native';
import CountdownScreen from '../screens/Home/HomeScreen'; // Import CountdownScreen
import StopwatchScreen from '../screens/Stopwatch/StopwatchScreen'; // Import StopwatchScreen
import BreathingMeterScreen from '../screens/BreathingMeter/BreathingMeter'; // Import BreathingMeterScreen
import { useTheme } from '../contexts/ThemeContext'; // Import the useTheme hook
import SavedData from '../screens/BreathingMeter/SavedData';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { theme } = useTheme(); // Get the current theme

  // Define styles dynamically based on the theme
  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      position: 'absolute', // Floating effect
      bottom: 15,
      left: 15,
      right: 15,
      borderRadius: 25,
      height: 60,
      borderTopWidth: 0, // Remove top border
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5, // Android shadow
    },
    label: {
      fontSize: 12,
      marginTop: 5,
      color: theme === 'dark' ? 'white' : 'black', // Change label color based on theme
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let scaleValue = new Animated.Value(1);

          if (route.name === 'Countdown') {
            iconName = focused ? 'timer' : 'timer-outline'; // Countdown icon
          } else if (route.name === 'Stopwatch') {
            iconName = focused ? 'clock' : 'clock-outline'; // Stopwatch icon
          } else if (route.name === 'BreathingMeter') {
            iconName = focused ? 'weather-windy' : 'weather-windy'; // Breathing Meter icon
          }

          // Animate scale when focused
          if (focused) {
            Animated.spring(scaleValue, {
              toValue: 1.2,
              friction: 4,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(scaleValue, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }).start();
          }

          return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Icon name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.label, { color: focused ? 'tomato' : theme === 'dark' ? 'lightgray' : 'gray' }]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: theme === 'dark' ? 'lightgray' : 'gray',
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen
        name="Countdown"
        component={CountdownScreen} // Countdown screen component
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen} // Stopwatch screen component
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="BreathingMeter"
        component={BreathingMeterScreen} // BreathingMeter screen component
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
