import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native'; // Import useTheme

const HomeScreen = () => {
  const { colors } = useTheme(); // Get the current theme colors
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Function to start the countdown
  const startCountdown = () => {
    const totalSeconds = parseInt(days) * 86400 + parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    setRemainingTime(totalSeconds);
    setIsRunning(true);
  };

  // Function to stop the countdown manually
  const stopCountdown = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setRemainingTime(0); // Reset the remaining time if needed
  };

  // Function to update the countdown timer
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      const id = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
    } else if (remainingTime === 0 && isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, remainingTime]);

  // Function to format the time
  const formatTime = (time) => {
    const d = Math.floor(time / (3600 * 24));
    const h = Math.floor((time % (3600 * 24)) / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isRunning && (
        <>
          <Text style={[styles.label, { color: colors.text }]}>Days:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={days}
            onChangeText={setDays}
            keyboardType="numeric"
            placeholder="Enter days"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={[styles.label, { color: colors.text }]}>Hours:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
            placeholder="Enter hours"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={[styles.label, { color: colors.text }]}>Minutes:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            placeholder="Enter minutes"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={[styles.label, { color: colors.text }]}>Seconds:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={seconds}
            onChangeText={setSeconds}
            keyboardType="numeric"
            placeholder="Enter seconds"
            placeholderTextColor={colors.placeholder}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={startCountdown}>
            <Text style={styles.buttonText}>Start Countdown</Text>
          </TouchableOpacity>
        </>
      )}
      {isRunning && (
        <View>
          <Text style={[styles.countdownText, { color: colors.notification }]}>
            Time Remaining: {formatTime(remainingTime)}
          </Text>
          <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.secondary }]} onPress={stopCountdown}>
            <Text style={styles.buttonText}>Stop Countdown</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isRunning && remainingTime === 0 && (
        <Text style={[styles.endText, { color: colors.success }]}>Countdown Ended!</Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  stopButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
  },
  endText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
