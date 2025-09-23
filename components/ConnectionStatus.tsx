import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ConnectionStatusProps {
  usingMockData: boolean;
  error?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  usingMockData, 
  error 
}) => {
  if (!usingMockData && !error) {
    return null;
  }

  return (
    <View style={[styles.container, usingMockData ? styles.warning : styles.error]}>
      <Text style={styles.text}>
        {usingMockData ? '⚠️ Using Demo Data' : '❌ Connection Error'}
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {usingMockData && (
        <Text style={styles.infoText}>
          Real API is unavailable in browser due to security restrictions.
          Use the mobile app for live data.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  warning: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  error: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ConnectionStatus;