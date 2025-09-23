// components/WebCORSNotice.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export const WebCORSNotice: React.FC = () => {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ℹ️ Note: Web version uses CORS proxy. Data loading might be slower.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  text: {
    color: '#1976d2',
    fontSize: 12,
    textAlign: 'center',
  },
});