// components/DashboardStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DashboardStatsProps {
  totalStations: number;
  activeStations: number;
  avgWaterLevel: number;
  dataPoints: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalStations,
  activeStations,
  avgWaterLevel,
  dataPoints
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groundwater Monitoring Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalStations}</Text>
          <Text style={styles.statLabel}>Total Stations</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeStations}</Text>
          <Text style={styles.statLabel}>Active Stations</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgWaterLevel.toFixed(1)}m</Text>
          <Text style={styles.statLabel}>Avg Water Level</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dataPoints}</Text>
          <Text style={styles.statLabel}>Data Points</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1a237e',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});