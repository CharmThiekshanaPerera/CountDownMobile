import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LungCapacityChecker = () => {
  const [isRelaxing, setIsRelaxing] = useState(false);
  const [isInhaling, setIsInhaling] = useState(false);
  const [isExhaling, setIsExhaling] = useState(false);
  const [inhaleHoldTime, setInhaleHoldTime] = useState(0);
  const [exhaleHoldTime, setExhaleHoldTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [relaxCompleted, setRelaxCompleted] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let interval;
    if (isInhaling || isExhaling) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isInhaling, isExhaling]);

  const startTest = () => {
    setIsRelaxing(true);
    setRelaxCompleted(false);
    setInhaleHoldTime(0);
    setExhaleHoldTime(0);
    setTimeout(() => {
      setIsRelaxing(false);
      setRelaxCompleted(true);
    }, 5000); // 5 seconds relax time
  };

  const startInhale = () => {
    setIsInhaling(true);
    setTimer(0);
  };

  const stopInhale = () => {
    setIsInhaling(false);
    setInhaleHoldTime(timer);
  };

  const startExhale = () => {
    setIsExhaling(true);
    setTimer(0);
  };

  const stopExhale = () => {
    setIsExhaling(false);
    setExhaleHoldTime(timer);
    Alert.alert(
      'Test Complete',
      `Inhale Hold Time: ${inhaleHoldTime} sec\nExhale Hold Time: ${exhaleHoldTime} sec`,
      [
        { text: 'Save', onPress: saveData },
        { text: 'Start New Session', onPress: startTest }
      ]
    );
  };

  const saveData = async () => {
    try {
      const testData = {
        inhaleHoldTime,
        exhaleHoldTime,
        timestamp: new Date().toISOString(),
      };
      const existingData = await AsyncStorage.getItem('lungCapacityData');
      const data = existingData ? JSON.parse(existingData) : [];
      data.push(testData);
      await AsyncStorage.setItem('lungCapacityData', JSON.stringify(data));
      navigation.navigate('SavedData');
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  return (
    <View style={styles.container}>
      {isRelaxing && (
        <>
          <Text style={styles.relaxText}>Relax yourself...</Text>
          <CountdownCircleTimer
            isPlaying
            duration={5}
            colors={['#004777']}
          >
            {({ remainingTime }) => <Text style={styles.timerText}>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </>
      )}
      {relaxCompleted && !isInhaling && !inhaleHoldTime && (
        <Button title="START INHALE" onPress={startInhale} />
      )}
      {isInhaling && (
        <>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={timer * 10} // Visualize holding time (assuming max 10 seconds for example)
            tintColor="#00e0ff"
            backgroundColor="#3d5875"
          >
            {() => <Text style={styles.timerText}>{timer} sec</Text>}
          </AnimatedCircularProgress>
          <Button title="STOP INHALE" onPress={stopInhale} />
        </>
      )}
      {!isInhaling && inhaleHoldTime > 0 && !isExhaling && (
        <>
          <Button title="START EXHALE" onPress={startExhale} />
        </>
      )}
      {isExhaling && (
        <>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={timer * 10} // Visualize holding time
            tintColor="#ff6347"
            backgroundColor="#3d5875"
          >
            {() => <Text style={styles.timerText}>{timer} sec</Text>}
          </AnimatedCircularProgress>
          <Button title="STOP EXHALE" onPress={stopExhale} />
        </>
      )}
      {!isRelaxing && !relaxCompleted && !isInhaling && !isExhaling && !inhaleHoldTime && (
        <Button title="Start Lung Capacity Test" onPress={startTest} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 40,
    color: '#000',
  },
  relaxText: {
    fontSize: 30,
    color: '#888',
    position: 'absolute',
    top: '20%',
    textAlign: 'center',
  },
});

export default LungCapacityChecker;
