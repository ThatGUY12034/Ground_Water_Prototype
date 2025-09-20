import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface GroundWaterRecord {
  stationCode: string;
  stationName: string;
  stationType: string;
  latitude: number;
  longitude: number;
  agencyName: string;
  state: string;
  district: string;
  dataValue: number;
  dataTime: string;
  wellType: string;
  wellDepth: number;
  wellAquiferType: string;
  description?: string;
  unit?: string;
}

interface WaterLevelCardProps {
  record: GroundWaterRecord;
}

export const WaterLevelCard: React.FC<WaterLevelCardProps> = ({ record }) => {
  const getWaterLevelColor = (level: number) => {
    if (level > -5) return '#4CAF50';
    if (level > -10) return '#FFC107';
    return '#F44336';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.stationName}>{record.stationName}</Text>
      <Text style={styles.district}>{record.district}, {record.state}</Text>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Water Level:</Text>
        <Text style={[styles.value, { color: getWaterLevelColor(record.dataValue) }]}>
          {record.dataValue.toFixed(2)} m
        </Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(record.dataTime).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.dataRow}>
        <Text style={styles.label}>Well Depth:</Text>
        <Text style={styles.value}>{record.wellDepth} m</Text>
      </View>
      
      <Text style={styles.stationCode}>Station: {record.stationCode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  district: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  stationCode: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});