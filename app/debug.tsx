// app/debug.tsx
import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { apiServiceDebug } from '../lib/services/apiServiceDebug';

export default function DebugScreen() {
  const [log, setLog] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setTesting(true);
    setLog([]);
    
    addLog('Starting API tests...');
    
   try {
  await apiServiceDebug.testVariousParameters();
  addLog('All tests completed');
} catch (error) {
  // Handle error safely
  if (error instanceof Error) {
    addLog(`Test failed: ${error.message}`);
  } else {
    addLog(`Test failed: ${String(error)}`);
  }
} finally {
  setTesting(false);
}


  const testSpecific = async () => {
    setTesting(true);
    addLog('Testing specific parameters...');
    
    try {
      const result = await apiServiceDebug.fetchGroundWaterData({
        stateName: 'Odisha',
        districtName: 'Baleshwar',
        startdate: '2024-01-01',
        enddate: '2024-01-02',
        size: 2
      });
      addLog(`Success: ${result.length} records`);
    } catch (error) {
      if (error instanceof Error) {
        addLog(`Test failed: ${error.message}`);
      } else {
        addLog(`Test failed: ${String(error)}`);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Debug Screen</Text>
      
      <View style={styles.buttons}>
        <Button 
          title="Run All Tests" 
          onPress={testAPI} 
          disabled={testing}
        />
        <Button 
          title="Test Specific" 
          onPress={testSpecific} 
          disabled={testing}
        />
      </View>

      <ScrollView style={styles.logContainer}>
        {log.map((entry, index) => (
          <Text key={index} style={styles.logEntry}>{entry}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  logContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  logEntry: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
}