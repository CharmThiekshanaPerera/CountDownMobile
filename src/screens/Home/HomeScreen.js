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

  const startCountdown = () => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(totalSeconds);
    setIsRunning(true);
    setShowPicker(false);
  };

  const stopCountdown = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setRemainingTime(0);
  };

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
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.danger }]}
            onPress={stopCountdown}
          >
            <FontAwesome name="stop" size={24} color={colors.background} />
            <Text
              style={[styles.iconButtonText, { color: colors.background }]}
            >
              Stop
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!isRunning && remainingTime === 0 && (
        <Text style={[styles.endText, { color: colors.success }]}>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  iconButtonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  runningContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  endText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
