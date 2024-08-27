// src/screens/TimerScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Timer from '../../contexts/Timer';

const focusOptions = [
  { label: "25 Minutes Focus", time: 1500 }, // 25 minutes
  { label: "45 Minutes Focus", time: 2700 }, // 45 minutes
];

const breakOptions = [
  { label: "5 Minutes Break", time: 300 },   // 5 minutes
  { label: "10 Minutes Break", time: 600 },  // 10 minutes
];

const TimerScreen = () => {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionTime, setCurrentSessionTime] = useState(focusOptions[0].time);
  const [selectedTime, setSelectedTime] = useState(focusOptions[0].time);

  const handleSelectFocusTime = (time) => {
    if (!isRunning) {
      setSelectedTime(time);
      setCurrentSessionTime(time);
      setIsFocusMode(true);
    }
  };

  const handleSelectBreakTime = (time) => {
    if (!isRunning) {
      setSelectedTime(time);
      setCurrentSessionTime(time);
      setIsFocusMode(false);
    }
  };

  const handleTimerComplete = () => {
    Alert.alert(isFocusMode ? "Focus Session Complete!" : "Break Complete!", "Ready for the next session?");
    setIsRunning(false);
    setIsFocusMode(!isFocusMode); // Toggle between focus and break mode
    setCurrentSessionTime(isFocusMode ? breakOptions[0].time : focusOptions[0].time); // Reset to default next session
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isFocusMode ? "Focus Mode" : "Break Mode"}</Text>
      <Timer
        isRunning={isRunning}
        duration={currentSessionTime}
        onComplete={handleTimerComplete}
      />

      <View style={styles.buttonContainer}>
        {focusOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.optionButton,
              selectedTime === option.time && isFocusMode ? styles.selectedButton : null,
            ]}
            onPress={() => handleSelectFocusTime(option.time)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {breakOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.optionButton,
              selectedTime === option.time && !isFocusMode ? styles.selectedButton : null,
            ]}
            onPress={() => handleSelectBreakTime(option.time)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.startButtonText}>{isRunning ? "Pause" : "Start"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  optionButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#1f2233',
    borderRadius: 5,
  },
  optionText: {
    color: '#FFF',
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: '#3944bc',
  },
  startButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#61dafb',
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 18,
    color: '#282c34',
  },
});

export default TimerScreen;
