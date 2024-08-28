// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
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
    navigation.navigate('CountDown');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to the Focus & Relaxation App</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          This app helps you improve focus and relaxation using customizable timers. 
          You can choose between pre-configured focus sessions and custom sessions to 
          suit your needs.
        </Text>

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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  cardTextContainer: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;
