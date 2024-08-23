import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native';
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
    setIsPaused(!isPaused);
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
            style={[styles.iconButton, styles.setTimerButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowPicker(true)}
          >
            <FontAwesome name="clock-o" size={24} color={colors.text} />
            <Text style={[styles.iconButtonText, { color: colors.text }]}>
              Set Timer
            </Text>
          </TouchableOpacity>
          <Modal transparent={true} visible={showPicker} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                {renderPicker('Days', days, setDays, 30)}
                {renderPicker('Hours', hours, setHours, 23)}
                {renderPicker('Minutes', minutes, setMinutes, 59)}
                {renderPicker('Seconds', seconds, setSeconds, 59)}
                <TouchableOpacity
                  style={[styles.iconButton, styles.startButton, { backgroundColor: colors.primary }]}
                  onPress={startCountdown}
                >
                  <FontAwesome name="check" size={24} color={colors.text} />
                  <Text style={[styles.iconButtonText, { color: colors.text }]}>
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
          <Text style={[styles.countdownText, { color: colors.text }]}>
            {formatTime(remainingTime)}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.iconButtonSmall, styles.stopButton, { backgroundColor: colors.notification }]}
              onPress={stopCountdown}
            >
              <FontAwesome name="stop" size={24} color={colors.text} />
              <Text style={[styles.iconButtonTextSmall, { color: colors.text }]}>
                Stop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButtonSmall, styles.pauseButton, { backgroundColor: colors.secondary }]}
              onPress={pauseCountdown}
            >
              <FontAwesome
                name={isPaused ? 'play' : 'pause'}
                size={24}
                color={colors.text}
              />
              <Text style={[styles.iconButtonTextSmall, { color: colors.text }]}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!isRunning && remainingTime === 0 && (
        <Text style={[styles.endText, { color: colors.text }]}>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.85,
    padding: 20,
    borderRadius: 15,
    elevation: 10,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  picker: {
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: 16,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  runningContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  iconButtonTextSmall: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  endText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
  },
  setTimerButton: {},
  startButton: {},
  stopButton: {},
  pauseButton: {},
});
