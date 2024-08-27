import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';

const LungCapacityChecker = () => {
  const { colors } = useTheme();
  const [isRelaxing, setIsRelaxing] = useState(false);
  const [isInhaling, setIsInhaling] = useState(false);
  const [isExhaling, setIsExhaling] = useState(false);
  const [inhaleHoldTime, setInhaleHoldTime] = useState(0);
  const [exhaleHoldTime, setExhaleHoldTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [relaxCompleted, setRelaxCompleted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
    setTimer(0);
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
    console.log(`Inhale Hold Time: ${inhaleHoldTime} sec`);
    console.log(`Exhale Hold Time: ${timer} sec`);
    setModalVisible(true); // Show the modal after stopping exhale
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
      console.log('Data to be saved:', data);
      await AsyncStorage.setItem('lungCapacityData', JSON.stringify(data));
      const savedData = await AsyncStorage.getItem('lungCapacityData');
      console.log('Saved Data:', JSON.parse(savedData));
      setModalVisible(false);
      navigation.navigate('SavedData');
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isRelaxing && (
        <>
          <Text style={[styles.relaxText, { color: colors.text }]}>Relax yourself...</Text>
          <CountdownCircleTimer
            isPlaying
            duration={5}
            colors={['#004777']}
          >
            {({ remainingTime }) => <Text style={[styles.timerText, { color: colors.text }]}>{remainingTime}</Text>}
          </CountdownCircleTimer>
        </>
      )}
      {relaxCompleted && !isInhaling && !inhaleHoldTime && (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={startInhale}>
          <Text style={[styles.buttonText, { color: colors.text }]}>START INHALE</Text>
        </TouchableOpacity>
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
            {() => <Text style={[styles.timerText, { color: colors.text }]}>{timer} sec</Text>}
          </AnimatedCircularProgress>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={stopInhale}>
            <Text style={[styles.buttonText, { color: colors.text }]}>STOP INHALE</Text>
          </TouchableOpacity>
        </>
      )}
      {!isInhaling && inhaleHoldTime > 0 && !isExhaling && (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={startExhale}>
          <Text style={[styles.buttonText, { color: colors.text }]}>START EXHALE</Text>
        </TouchableOpacity>
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
            {() => <Text style={[styles.timerText, { color: colors.text }]}>{timer} sec</Text>}
          </AnimatedCircularProgress>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={stopExhale}>
            <Text style={[styles.buttonText, { color: colors.text }]}>STOP EXHALE</Text>
          </TouchableOpacity>
        </>
      )}
      {!isRelaxing && !relaxCompleted && !isInhaling && !isExhaling && !inhaleHoldTime && (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={startTest}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Start Lung Capacity Test</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>Test Complete</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Inhale Hold Time: {inhaleHoldTime} sec</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>Exhale Hold Time: {exhaleHoldTime} sec</Text>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={saveData}>
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setModalVisible(false);
                startTest();
              }}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Start New Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  relaxText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LungCapacityChecker;
