//CountDown.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, FlatList, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CountDown = () => {
  const { colors } = useTheme();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [savedTimers, setSavedTimers] = useState([]);
  const intervalRef = useRef(null);

  const startCountdown = () => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setShowPicker(false);
  };

  const stopCountdown = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemainingTime(0);
  };

  const pauseCountdown = () => {
    setIsPaused(!isPaused);
  };

  const saveCountdown = async () => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      const formattedTime = formatTime(totalSeconds);
      const newSavedTimers = [...savedTimers, { time: totalSeconds, formatted: formattedTime }];
      setSavedTimers(newSavedTimers);
      await AsyncStorage.setItem('savedTimers', JSON.stringify(newSavedTimers));
      setShowPicker(false);
    }
  };

  const loadSavedTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('savedTimers');
    if (storedTimers) {
      setSavedTimers(JSON.parse(storedTimers));
    }
  };

  const startSavedCountdown = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
  };

  const deleteSavedTimer = async (index) => {
    const updatedTimers = savedTimers.filter((_, i) => i !== index);
    setSavedTimers(updatedTimers);
    await AsyncStorage.setItem('savedTimers', JSON.stringify(updatedTimers));
  };

  const confirmDelete = (index) => {
    Alert.alert(
      "Delete Timer",
      "Are you sure you want to delete this timer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteSavedTimer(index) }
      ]
    );
  };

  useEffect(() => {
    loadSavedTimers();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
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

  const renderSavedTimer = ({ item, index }) => (
    <View style={styles.savedTimerContainer}>
      <Text style={[styles.savedTimerText, { color: colors.text }]}>
        {item.formatted}
      </Text>
      <View style={styles.savedTimerButtons}>
        <TouchableOpacity
          style={[styles.iconButtonSmall, styles.startSavedButton, { backgroundColor: colors.primary }]}
          onPress={() => startSavedCountdown(item.time)}
        >
          <FontAwesome name="play" size={24} color={colors.text} />
          <Text style={[styles.iconButtonTextSmall, { color: colors.text }]}>
            Start
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButtonSmall, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => confirmDelete(index)}
        >
          <FontAwesome name="trash" size={24} color={colors.text} />
          <Text style={[styles.iconButtonTextSmall, { color: colors.text }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isRunning) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={savedTimers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSavedTimer}
        ListHeaderComponent={
          <Text style={[styles.savedTimerHeader, { color: colors.text }]}>
            Saved Timers:
          </Text>
        }
      />

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
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.saveButton, { backgroundColor: colors.secondary }]}
                    onPress={saveCountdown}
                  >
                    <FontAwesome name="save" size={24} color={colors.text} />
                    <Text style={[styles.iconButtonText, { color: colors.text }]}>
                      Save
                    </Text>
                  </TouchableOpacity>
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
            </View>
          </Modal>
        </>
      )}
      {!isRunning && remainingTime === 0 && (
        <Text style={[styles.endText, { color: colors.text }]}>
          Time's Up!
        </Text>
      )}
    </View>
  );
};

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
    //marginTop: '20%',
    marginBottom: '20%', // Increased margin bottom
  },
  setTimerButton: {
    marginTop: '20%',
    //marginBottom: '20%', // Increased margin bottom
  },
  startButton: {},
  stopButton: {
    backgroundColor: 'red',
  },
  pauseButton: {
    backgroundColor: 'orange',
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green
  },
  startSavedButton: {
    backgroundColor: '#2196F3', // Blue
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red
  },
  savedTimerHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  savedTimerText: {
    fontSize: 16,
    marginVertical: 5,
  },
  savedTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  savedTimerButtons: {
    flexDirection: 'row',
  },
});

export default CountDown;
