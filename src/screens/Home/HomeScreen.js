import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const { colors } = useTheme();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startCountdown = () => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setShowPicker(false);
  };

  const stopCountdown = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setRemainingTime(0);
  };

  const pauseCountdown = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (isRunning && !isPaused && remainingTime > 0) {
      const id = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
    } else if (remainingTime === 0 && isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused, remainingTime]);

  const formatTime = (time) => {
    const d = Math.floor(time / (3600 * 24));
    const h = Math.floor((time % (3600 * 24)) / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const renderPicker = (label, value, setValue, max) => (
    <View style={styles.pickerContainer}>
      <Text style={[styles.pickerLabel, { color: colors.text }]}>{label}</Text>
      <Picker
        selectedValue={value}
        style={[
          styles.picker,
          {
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        onValueChange={(itemValue) => setValue(itemValue)}
      >
        {[...Array(max + 1).keys()].map((num) => (
          <Picker.Item key={num} label={String(num)} value={num} />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isRunning && (
        <>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPicker(true)}
          >
            <FontAwesome name="clock-o" size={24} color={colors.background} />
            <Text style={[styles.iconButtonText, { color: colors.background }]}>
              Set Timer
            </Text>
          </TouchableOpacity>
          <Modal transparent={true} visible={showPicker} animationType="slide">
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.card },
                ]}
              >
                {renderPicker('Days', days, setDays, 30)}
                {renderPicker('Hours', hours, setHours, 23)}
                {renderPicker('Minutes', minutes, setMinutes, 59)}
                {renderPicker('Seconds', seconds, setSeconds, 59)}
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: colors.success }]}
                  onPress={startCountdown}
                >
                  <FontAwesome name="check" size={24} color={colors.background} />
                  <Text
                    style={[styles.iconButtonText, { color: colors.background }]}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
      {isRunning && (
        <View style={styles.runningContainer}>
          <Text
            style={[styles.countdownText, { color: colors.notification }]}
          >
            {formatTime(remainingTime)}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.iconButtonSmall, { backgroundColor: colors.danger }]}
              onPress={stopCountdown}
            >
              <FontAwesome name="stop" size={24} color={colors.background} />
              <Text
                style={[styles.iconButtonTextSmall, { color: colors.background }]}
              >
                Stop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButtonSmall, { backgroundColor: colors.warning }]}
              onPress={pauseCountdown}
            >
              <FontAwesome
                name={isPaused ? "play" : "pause"}
                size={24}
                color={colors.background}
              />
              <Text
                style={[styles.iconButtonTextSmall, { color: colors.background }]}
              >
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!isRunning && remainingTime === 0 && (
        <Text style={[styles.endText, { color: colors.primary }]}>
          Time's Up!
        </Text>
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
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 3, // Adds subtle shadow for a raised effect
  },
  iconButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  iconButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 5,
    elevation: 2, // Smaller shadow effect for small buttons
  },
  iconButtonTextSmall: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  runningContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  endText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Translucent background for the modal
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    elevation: 5, // Enhanced shadow for a floating modal effect
  },
  pickerContainer: {
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  picker: {
    borderRadius: 10,
    paddingVertical: 8,
  },
});
