// components/EnhancedWaterLevelCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { GroundWaterRecord } from './WaterLevelCard';

interface EnhancedWaterLevelCardProps {
  record: GroundWaterRecord;
  onAlertPress?: () => void;
}

export const EnhancedWaterLevelCard: React.FC<EnhancedWaterLevelCardProps> = ({ 
  record, 
  onAlertPress 
}) => {
  const getCriticalLevel = (level: number) => {
    if (level < -15) return { status: 'CRITICAL', color: '#d32f2f', icon: '🔴' };
    if (level < -10) return { status: 'HIGH', color: '#ff9800', icon: '🟠' };
    if (level < -5) return { status: 'MODERATE', color: '#ffeb3b', icon: '🟡' };
    return { status: 'NORMAL', color: '#4caf50', icon: '🟢' };
  };

  const criticalInfo = getCriticalLevel(record.dataValue);
  const isCritical = record.dataValue < -10;

  return (
    <View style={[styles.card, isCritical && styles.criticalCard]}>
      {isCritical && (
        <View style={[styles.alertBanner, { backgroundColor: criticalInfo.color }]}>
          <Text style={styles.alertText}>
            {criticalInfo.icon} {criticalInfo.status} WATER LEVEL
          </Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.stationName}>{record.stationName}</Text>
        <View style={[styles.statusIndicator, { backgroundColor: criticalInfo.color }]} />
      </View>
      
      <Text style={styles.district}>{record.district}, {record.state}</Text>
      
      <View style={styles.dataGrid}>
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Current Level</Text>
          <Text style={[styles.dataValue, { color: criticalInfo.color }]}>
            {record.dataValue.toFixed(2)} m
          </Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Well Depth</Text>
          <Text style={styles.dataValue}>{record.wellDepth} m</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Last Update</Text>
          <Text style={styles.dataValue}>
            {new Date(record.dataTime).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={styles.dataLabel}>Aquifer Type</Text>
          <Text style={styles.dataValue}>{record.wellAquiferType}</Text>
        </View>
      </View>
      
      {isCritical && (
        <Text style={styles.recommendation}>
          💡 Recommendation: Consider water conservation measures
        </Text>
      )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  criticalCard: {
    borderWidth: 2,
    borderColor: '#ff5252',
  },
  alertBanner: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  alertText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  district: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
});