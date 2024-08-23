// App.js
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext'; // Import ThemeProvider
import AppContainer from './src/navigations/AppNavigation';

export default function App() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}
