// app/(tabs)/index.tsx
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ScrollView 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGroundWaterData } from '../../lib/hooks/useGroundWaterData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { WebCORSNotice } from '../../components/WebCORSNotice';
import { STATES, ODISHA_DISTRICTS } from '../../lib/constants/config';
import { DashboardStats } from '../../components/DashboardStats';
import { WaterLevelChart } from '../../components/WaterLevelChart';
import { EnhancedWaterLevelCard } from '../../components/EnhancedWaterLevelCard';

import ConnectionStatus from '../../components/ConnectionStatus';

export default function HomeScreen() {
  const [selectedState, setSelectedState] = useState('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState('Baleshwar');

  const { data, loading, error, usingMockData, refreshData } = useGroundWaterData({
    stateName: selectedState,
    districtName: selectedDistrict,
    startdate: '2024-01-01',
    enddate: '2024-01-31',
    size: 30,
  });

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

  // Calculate dashboard statistics
  const dashboardData = useMemo(() => {
    const uniqueStations = [...new Set(data.map(item => item.stationCode))];
    const avgLevel = data.length > 0 ? 
      data.reduce((sum, item) => sum + item.dataValue, 0) / data.length : 0;
    
    return {
      totalStations: uniqueStations.length,
      activeStations: uniqueStations.length, // Assuming all are active
      avgWaterLevel: avgLevel,
      dataPoints: data.length
    };
  }, [data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return data.slice(-10).map(item => ({
      date: item.dataTime,
      level: item.dataValue
    }));
  }, [data]);

  // Get unique stations for the chart
  const uniqueStations = useMemo(() => {
    return [...new Set(data.map(item => item.stationName))];
  }, [data]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
        <ErrorMessage error={error} onRetry={refreshData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
      
      <ConnectionStatus usingMockData={usingMockData} error={error} />
      
      
     

      <WebCORSNotice />
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={['#007AFF']}
          />
        }
      >
        {/* Dashboard Statistics */}
        <DashboardStats {...dashboardData} />
        
        {/* Water Level Chart - Show for first station or selected station */}
        {data.length > 0 && (
          <WaterLevelChart 
            data={chartData} 
            stationName={uniqueStations[0] || 'Monitoring Station'} 
          />
        )}

        {/* Stations List */}
        <Text style={styles.sectionTitle}>📡 Monitoring Stations ({data.length})</Text>
        
        {data.length > 0 ? (
          data.map((item, index) => (
            <EnhancedWaterLevelCard 
              key={`${item.stationCode}-${item.dataTime}-${index}`} 
              record={item} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No station data available for selected criteria</Text>
            <Text style={styles.emptySubtext}>
              Try selecting a different state or district, or check your connection
            </Text>
          </View>
        )}
        
        {/* Footer Space */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#1a237e',
  },
  filters: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  pickerContainer: {
    marginRight: 16,
    minWidth: 150,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  picker: {
    height: 50,
    width: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    height: 40,
  },
});