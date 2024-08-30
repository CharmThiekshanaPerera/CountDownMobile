// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const slideAnim = new Animated.Value(-Dimensions.get('window').width);

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const navigateToTimerScreen = () => {
    navigation.navigate('TimerScreen');
  };

  const navigateToCountDownScreen = () => {
    navigation.navigate('Countdown');
  };

  const navigateToStopwatchScreen = () => {
    navigation.navigate('Timer');
  };

  const navigateToBreathingMeterScreen = () => {
    navigation.navigate('Breathing');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <Text style={[styles.title, { color: colors.text }]}>Focus & Relax</Text>
        {/* <Text style={[styles.description, { color: colors.text }]}>
          This app helps you improve focus and relaxation using customizable timers. 
          You can choose between pre-configured focus sessions and custom sessions to 
          suit your needs.
        </Text> */}
        <Image
          source={require('../../../assets/icon.png')} // Replace with the path to your logo
          style={styles.logo}
        />

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={navigateToTimerScreen}
          >
            <FontAwesome name="clock-o" size={30} color={colors.primary} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Pre-configured Focus Sessions</Text>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                Select from 25 or 45-minute sessions to enhance your focus.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={navigateToCountDownScreen}
          >
            <FontAwesome name="hourglass-start" size={30} color={colors.primary} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Custom Focus Session</Text>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                Set your own focus session duration and manage your time effectively.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={navigateToStopwatchScreen}
          >
            <MaterialCommunityIcons name="timer-sand" size={30} color={colors.primary} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Stopwatch for Improving Focus</Text>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                Use the stopwatch to time your focus sessions and improve concentration.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={navigateToBreathingMeterScreen}
          >
            <MaterialCommunityIcons name="weather-windy" size={30} color={colors.primary} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Breathing Exercise Timer</Text>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                Practice breathing exercises with a timer to relax and focus better.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTextContainer: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default HomeScreen;
