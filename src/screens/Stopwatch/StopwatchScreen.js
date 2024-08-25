import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

const StopwatchScreen = () => {
  const { colors } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [savedRecords, setSavedRecords] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startStopwatch = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const pauseStopwatch = () => {
    setIsPaused(!isPaused);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setElapsedTime(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const saveRecord = async () => {
    const newRecord = formatTime(elapsedTime);
    const updatedRecords = [...savedRecords, { time: elapsedTime, formatted: newRecord }];
    setSavedRecords(updatedRecords);
    await AsyncStorage.setItem('stopwatchRecords', JSON.stringify(updatedRecords));
  };

  const loadSavedRecords = async () => {
    const storedRecords = await AsyncStorage.getItem('stopwatchRecords');
    if (storedRecords) {
      setSavedRecords(JSON.parse(storedRecords));
    }
  };

  const deleteRecord = async (index) => {
    const updatedRecords = savedRecords.filter((_, i) => i !== index);
    setSavedRecords(updatedRecords);
    await AsyncStorage.setItem('stopwatchRecords', JSON.stringify(updatedRecords));
  };

  const confirmDelete = (index) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteRecord(index) }
      ]
    );
  };

  useEffect(() => {
    loadSavedRecords();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderRecord = ({ item, index }) => (
    <View style={styles.recordContainer}>
      <Text style={[styles.recordText, { color: colors.text }]}>
        {item.formatted}
      </Text>
      <TouchableOpacity
        style={[styles.iconButtonSmall, styles.deleteButton, { backgroundColor: colors.error }]}
        onPress={() => confirmDelete(index)}
      >
        <FontAwesome name="trash" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Stopwatch</Text>

      <Text style={[styles.stopwatchText, { color: colors.text }]}>
        {formatTime(elapsedTime)}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.iconButton, styles.startButton, { backgroundColor: colors.primary }]}
          onPress={isRunning ? (isPaused ? startStopwatch : pauseStopwatch) : startStopwatch}
        >
          <FontAwesome name={isRunning ? (isPaused ? 'play' : 'pause') : 'play'} size={24} color={colors.text} />
          <Text style={[styles.iconButtonText, { color: colors.text }]}>
            {isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.stopButton, { backgroundColor: colors.notification }]}
          onPress={stopStopwatch}
        >
          <FontAwesome name="stop" size={24} color={colors.text} />
          <Text style={[styles.iconButtonText, { color: colors.text }]}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.resetButton, { backgroundColor: colors.secondary }]}
          onPress={resetStopwatch}
        >
          <FontAwesome name="refresh" size={24} color={colors.text} />
          <Text style={[styles.iconButtonText, { color: colors.text }]}>Reset</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.iconButton, styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={saveRecord}
        disabled={!isRunning || elapsedTime === 0}
      >
        <FontAwesome name="save" size={24} color={colors.text} />
        <Text style={[styles.iconButtonText, { color: colors.text }]}>Save Record</Text>
      </TouchableOpacity>

      <FlatList
        data={savedRecords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRecord}
        ListHeaderComponent={
          <Text style={[styles.savedRecordsHeader, { color: colors.text }]}>
            Saved Records:
          </Text>
        }
      />
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
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stopwatchText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  iconButtonSmall: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  iconButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#007bff',
  },
  stopButton: {
    backgroundColor: '#ff4d4d',
  },
  resetButton: {
    backgroundColor: '#ffbb33',
  },
  saveButton: {
    backgroundColor: '#28a745',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginLeft: 10,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recordText: {
    fontSize: 18,
  },
  savedRecordsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
});

export default StopwatchScreen;
