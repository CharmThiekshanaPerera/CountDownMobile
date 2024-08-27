
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Animated } from 'react-native';
import CountdownScreen from '../screens/Home/HomeScreen';
import StopwatchScreen from '../screens/Stopwatch/StopwatchScreen';
import BreathingMeterScreen from '../screens/BreathingMeter/BreathingMeter';
import TimerScreen from '../screens/Focus/TimerScreen'; // Import TimerScreen
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      position: 'absolute',
      bottom: 15,
      left: 15,
      right: 15,
      borderRadius: 25,
      height: 60,
      borderTopWidth: 0,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5,
    },
    label: {
      fontSize: 12,
      marginTop: 5,
      color: theme === 'dark' ? 'white' : 'black',
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let scaleValue = new Animated.Value(1);

          if (route.name === 'Countdown') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Stopwatch') {
            iconName = focused ? 'clock' : 'clock-outline';
          } else if (route.name === 'BreathingMeter') {
            iconName = focused ? 'weather-windy' : 'weather-windy';
          } else if (route.name === 'Timer') {
            iconName = focused ? 'timer-sand' : 'timer-sand-empty'; // Timer icon
          }

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
        component={CountdownScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="BreathingMeter"
        component={BreathingMeterScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen} // Add TimerScreen here
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
