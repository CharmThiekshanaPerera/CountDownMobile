// src/components/Timer.js
import React from 'react';
import { Text } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const Timer = ({ isRunning, duration, onComplete }) => {
  return (
    <CountdownCircleTimer
      isPlaying={isRunning}
      duration={duration}
      colors={['#004777', '#F7B801', '#A30000']} // Simplified color array
      colorsTime={[0.4 * duration, 0.4 * duration, duration]} // Time at which colors change
      onComplete={onComplete}
      key={duration} // Force timer reset when duration changes
    >
      {({ remainingTime }) => (
        <Text style={{ fontSize: 48, color: '#FFF' }}>
          {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}
        </Text>
      )}
    </CountdownCircleTimer>
  );
};

export default Timer;
