// app/(tabs)/index.tsx
import React, { useState } from 'react';
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
import { WaterLevelCard } from '../../components/WaterLevelCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { STATES, ODISHA_DISTRICTS } from '../../lib/constants/config';

export default function HomeScreen() {
  const [selectedState, setSelectedState] = useState('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState('Baleshwar');

  const { data, loading, error, refreshData } = useGroundWaterData({
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

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorMessage error={error} onRetry={refreshData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groundwater Level Monitor</Text>
      
      <ScrollView 
        style={styles.filters}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>State:</Text>
          <Picker
            selectedValue={selectedState}
            style={styles.picker}
            onValueChange={handleStateChange}
          >
            {STATES.map(state => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
        </View>

        {selectedState === 'Odisha' && (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>District:</Text>
            <Picker
              selectedValue={selectedDistrict}
              style={styles.picker}
              onValueChange={handleDistrictChange}
            >
              <Picker.Item label="All Districts" value="" />
              {ODISHA_DISTRICTS.map(district => (
                <Picker.Item key={district} label={district} value={district} />
              ))}
            </Picker>
          </View>
        )}
      </ScrollView>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.stationCode}-${item.dataTime}`}
          renderItem={({ item }) => <WaterLevelCard record={item} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshData}
              colors={['#007AFF']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          }
        />
      )}
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
    color: '#333',
  },
  filters: {
    padding: 16,
    backgroundColor: 'white',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});