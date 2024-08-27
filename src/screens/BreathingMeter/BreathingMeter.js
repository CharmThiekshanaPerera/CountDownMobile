import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const LungCapacityChecker = () => {
  const [isRelaxing, setIsRelaxing] = useState(false);
  const [isInhaling, setIsInhaling] = useState(false);
  const [isExhaling, setIsExhaling] = useState(false);
  const [inhaleHoldTime, setInhaleHoldTime] = useState(0);
  const [exhaleHoldTime, setExhaleHoldTime] = useState(0);
  const [timer, setTimer] = useState(0);

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
    setTimeout(() => {
      setIsRelaxing(false);
      startInhale();
    }, 5000); // 5 seconds relax time
  };

  const startInhale = () => {
    setIsInhaling(true);
    setTimer(0);
  };

  const stopInhale = () => {
    setIsInhaling(false);
    setInhaleHoldTime(timer);
    startExhale();
  };

  const startExhale = () => {
    setIsExhaling(true);
    setTimer(0);
  };

  const stopExhale = () => {
    setIsExhaling(false);
    setExhaleHoldTime(timer);
    Alert.alert('Test Complete', `Inhale Hold Time: ${inhaleHoldTime} sec\nExhale Hold Time: ${exhaleHoldTime} sec`);
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
      {isInhaling && (
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={timer * 10} // Visualize holding time (assuming max 10 seconds for example)
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
        >
          {() => <Text style={styles.timerText}>{timer} sec</Text>}
        </AnimatedCircularProgress>
      )}
      {isExhaling && (
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={timer * 10} // Visualize holding time
          tintColor="#ff6347"
          backgroundColor="#3d5875"
        >
          {() => <Text style={styles.timerText}>{timer} sec</Text>}
        </AnimatedCircularProgress>
      )}
      {!isRelaxing && !isInhaling && !isExhaling && (
        <Button title="Start Lung Capacity Test" onPress={startTest} />
      )}
      {!isRelaxing && isInhaling && (
        <Button title="Stop Inhale" onPress={stopInhale} />
      )}
      {!isRelaxing && isExhaling && (
        <Button title="Stop Exhale" onPress={stopExhale} />
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
