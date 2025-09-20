import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>Error: {error}</Text>
    {onRetry && (
      <Button title="Try Again" onPress={onRetry} color="#007AFF" />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});