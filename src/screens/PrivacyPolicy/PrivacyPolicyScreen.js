// src/screens/PrivacyPolicy/PrivacyPolicyScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>
      <Text style={styles.content}>
        This is where your app's privacy policy will be displayed. You can add
        the full text here or load it from a remote source if needed. 
      </Text>
      <Text style={styles.content}>
        Make sure to include all necessary information regarding user data
        collection, processing, and storage. Also, mention how users can
        contact you if they have questions or concerns about their privacy.
      </Text>
      {/* Add more sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen;
