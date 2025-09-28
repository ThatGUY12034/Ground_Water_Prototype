// app/(tabs)/index.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGroundWaterData } from '../../lib/hooks/useGroundWaterData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { WebCORSNotice } from '../../components/WebCORSNotice';
import { DashboardStats } from '../../components/DashboardStats';
import { WaterLevelChart } from '../../components/WaterLevelChart';
import { EnhancedWaterLevelCard } from '../../components/EnhancedWaterLevelCard';
import ConnectionStatus from '../../components/ConnectionStatus';

import { STATES, getDistricts } from '../../lib/constants/config';

export default function TabOneScreen() {
  const [selectedState, setSelectedState] = useState('Odisha');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-01-31'));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [pythonApiConnected, setPythonApiConnected] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const districtsForState = getDistricts(selectedState);

  // Auto-select first district when state changes
  useEffect(() => {
    if (districtsForState.length > 0 && !selectedDistrict) {
      setSelectedDistrict(districtsForState[0]);
    }
  }, [selectedState, districtsForState]);

  // Use the enhanced hook with ML features
  const { 
    data, 
    loading, 
    error, 
    usingMockData, 
    usingPythonApi,
    hasMLPredictions,
    fetchData, 
    updateParams,
    testPythonApi,
    trainMLModel
  } = useGroundWaterData({
    stateName: '',
    districtName: '',
    startdate: '',
    enddate: '',
    size: 30,
  });

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setShowStateModal(false);
    // Reset district when state changes
    setSelectedDistrict('');
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setShowDistrictModal(false);
  };

  const handleStartDateChange = (event: any, date?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (date) setStartDate(date);
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (date) setEndDate(date);
  };

  // Test Python API connection
  const testPythonConnection = async () => {
    const connected = await testPythonApi();
    setPythonApiConnected(connected);
    Alert.alert(
      connected ? '✅ Python API Connected' : '❌ Python API Unavailable',
      connected ? 'Your ML backend is ready!' : 'Check if Python API is running on port 8000'
    );
  };

  // Train ML model
  const handleTrainModel = async () => {
    Alert.alert('Train ML Model', 'This will train the groundwater prediction model. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Train', 
        onPress: async () => {
          const result = await trainMLModel();
          Alert.alert('Training Result', result.message || 'Training completed');
        }
      }
    ]);
  };

  const handleSearch = async () => {
    if (!selectedState) {
      Alert.alert('Error', 'Please select a state');
      return;
    }
    
    if (!selectedDistrict) {
      Alert.alert('Error', 'Please select a district');
      return;
    }

    // Update parameters
    updateParams({
      stateName: selectedState,
      districtName: selectedDistrict,
      startdate: formatDate(startDate),
      enddate: formatDate(endDate),
    });

    setHasSearched(true);
    
    // Manually trigger data fetch
    await fetchData();
  };

  // Dashboard statistics - only show when we have data
  const dashboardData = useMemo(() => {
    if (!hasSearched || data.length === 0) {
      return {
        totalStations: 0,
        activeStations: 0,
        avgWaterLevel: 0,
        dataPoints: 0,
        mlPredictions: hasMLPredictions
      };
    }

    const uniqueStations = [...new Set(data.map(item => item.stationCode))];
    const avgLevel = data.reduce((sum, item) => sum + item.dataValue, 0) / data.length;
    
    return {
      totalStations: uniqueStations.length,
      activeStations: uniqueStations.length,
      avgWaterLevel: parseFloat(avgLevel.toFixed(2)),
      dataPoints: data.length,
      mlPredictions: hasMLPredictions
    };
  }, [data, hasSearched, hasMLPredictions]);

  const chartData = useMemo(() => {
    return hasSearched && data.length > 0 ? data.slice(-10).map(item => ({
      date: item.dataTime,
      level: item.dataValue,
      prediction: (item as any).ml_prediction // Include ML predictions in chart
    })) : [];
  }, [data, hasSearched]);

  const uniqueStations = useMemo(() => {
    return hasSearched ? [...new Set(data.map(item => item.stationName))] : [];
  }, [data, hasSearched]);

  // Custom Picker Modal for States
  const StatePickerModal = () => (
    <Modal
      visible={showStateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowStateModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select State</Text>
          <FlatList
            data={STATES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedState === item && styles.modalItemSelected
                ]}
                onPress={() => handleStateSelect(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedState === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowStateModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Custom Picker Modal for Districts
  const DistrictPickerModal = () => (
    <Modal
      visible={showDistrictModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDistrictModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select District</Text>
          <Text style={styles.modalSubtitle}>State: {selectedState}</Text>
          <FlatList
            data={districtsForState}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedDistrict === item && styles.modalItemSelected
                ]}
                onPress={() => handleDistrictSelect(item)}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedDistrict === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowDistrictModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Show initial state before search
  if (!hasSearched) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
        
        {/* ML Connection Status */}
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>
            {pythonApiConnected ? '🔗 ML API Connected' : '📡 Testing Connection...'}
          </Text>
          <TouchableOpacity onPress={testPythonConnection}>
            <Text style={styles.testConnectionText}>Test</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          {/* State Selection */}
          <Text style={styles.pickerLabel}>Select State</Text>
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowStateModal(true)}
          >
            <Text style={styles.pickerButtonText}>
              {selectedState || 'Tap to select state'}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </TouchableOpacity>

          {/* District Selection */}
          <Text style={styles.pickerLabel}>Select District</Text>
          <TouchableOpacity 
            style={[
              styles.pickerButton,
              !selectedState && styles.pickerButtonDisabled
            ]}
            onPress={() => selectedState && setShowDistrictModal(true)}
            disabled={!selectedState}
          >
            <Text style={[
              styles.pickerButtonText,
              !selectedState && styles.pickerButtonTextDisabled
            ]}>
              {selectedDistrict || 'Select state first'}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </TouchableOpacity>

          {/* Date Selection Row */}
          <View style={styles.dateRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.pickerLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateColumn}>
              <Text style={styles.pickerLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              maximumDate={new Date()}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}

          {/* ML Actions */}
          <View style={styles.mlActions}>
            <TouchableOpacity style={styles.mlButton} onPress={testPythonConnection}>
              <Text style={styles.mlButtonText}>Test ML API</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mlButton} onPress={handleTrainModel}>
              <Text style={styles.mlButtonText}>Train Model</Text>
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <TouchableOpacity 
            style={[
              styles.searchButton,
              (!selectedState || !selectedDistrict) && styles.searchButtonDisabled
            ]} 
            onPress={handleSearch}
            disabled={!selectedState || !selectedDistrict}
          >
            <Text style={styles.searchButtonText}>
              🔍 Search Groundwater Data
            </Text>
          </TouchableOpacity>
        </View>

        <StatePickerModal />
        <DistrictPickerModal />

        <View style={styles.initialState}>
          <Text style={styles.initialStateTitle}>Welcome to Groundwater Intelligence</Text>
          <Text style={styles.initialStateText}>
            Select your state, district, and date range above to search for groundwater monitoring data.
          </Text>
          <Text style={styles.initialStateSubtext}>
            🤖 Now with ML-powered predictions from your Python API
          </Text>
          <Text style={styles.initialStateSubtext}>
            📡 Data sourced from India WRIS Groundwater Monitoring Network
          </Text>
        </View>
      </View>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
        
        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>
            {usingPythonApi ? '🔗 Using ML API' : '📡 Using Direct Connection'}
          </Text>
          {hasMLPredictions && (
            <Text style={styles.mlBadge}>🤖 ML Active</Text>
          )}
        </View>

        <View style={styles.filters}>
          <Text style={styles.pickerLabel}>Searching for: {selectedState}, {selectedDistrict}</Text>
          <Text style={styles.pickerLabel}>
            Date Range: {formatDate(startDate)} to {formatDate(endDate)}
          </Text>
        </View>
        <LoadingSpinner />
        <Text style={styles.loadingText}>
          {usingPythonApi ? 'Fetching data with ML predictions...' : 'Fetching groundwater data...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 Groundwater Intelligence Platform</Text>
      
      {/* Connection Status */}
      <View style={styles.connectionStatus}>
        <Text style={styles.connectionText}>
          {usingPythonApi ? '🔗 Connected to ML API' : '📡 Direct WRS Connection'}
        </Text>
        {hasMLPredictions && (
          <Text style={styles.mlBadge}>🤖 ML Predictions Available</Text>
        )}
      </View>

      <View style={styles.filters}>
        {/* Keep filters visible */}
        <Text style={styles.pickerLabel}>Select State</Text>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setShowStateModal(true)}
        >
          <Text style={styles.pickerButtonText}>{selectedState}</Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.pickerLabel}>Select District</Text>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setShowDistrictModal(true)}
        >
          <Text style={styles.pickerButtonText}>{selectedDistrict}</Text>
          <Text style={styles.pickerButtonArrow}>▼</Text>
        </TouchableOpacity>

        <View style={styles.dateRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.pickerLabel}>Start Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateColumn}>
            <Text style={styles.pickerLabel}>End Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            maximumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
            maximumDate={new Date()}
          />
        )}

        {/* ML Actions */}
        <View style={styles.mlActions}>
          <TouchableOpacity style={styles.mlButton} onPress={testPythonConnection}>
            <Text style={styles.mlButtonText}>Test ML API</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mlButton} onPress={handleTrainModel}>
            <Text style={styles.mlButtonText}>Train Model</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍 Search Again</Text>
        </TouchableOpacity>
      </View>

      <StatePickerModal />
      <DistrictPickerModal />

      {usingMockData && data.length > 0 && (
        <View style={styles.mockDataNotice}>
          <Text style={styles.mockDataText}>
            📊 Showing sample data - Real API connection unavailable
          </Text>
        </View>
      )}

      <WebCORSNotice />

      <ScrollView style={styles.content}>
        {error && !usingMockData && (
          <ErrorMessage error={error} onRetry={handleSearch} />
        )}

        {data.length > 0 ? (
          <>
            <DashboardStats {...dashboardData} />

            {chartData.length > 0 && (
              <WaterLevelChart 
                data={chartData} 
                stationName={uniqueStations[0] || 'Monitoring Station'}
              />
            )}

            <Text style={styles.sectionTitle}>
              📡 Monitoring Stations ({data.length})
              {usingMockData && ' - Sample Data'}
              {hasMLPredictions && ' - 🤖 ML Enhanced'}
            </Text>
            
            {data.map((item, index) => (
              <EnhancedWaterLevelCard 
                key={`${item.stationCode}-${item.dataTime}-${index}`} 
                record={item}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No station data available for selected criteria</Text>
            <Text style={styles.emptySubtext}>
              Try selecting a different state, district, or date range
            </Text>
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleSearch}>
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, color: '#1a237e' },
  filters: { padding: 16, backgroundColor: 'white', marginHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  pickerLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  content: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginVertical: 16, color: '#333' },
  emptyContainer: { padding: 40, alignItems: 'center', backgroundColor: 'white', margin: 16, borderRadius: 12 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 16 },
  footer: { height: 40 },
  
  // New styles for custom pickers
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerButtonTextDisabled: {
    color: '#999',
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: '#666',
  },
  
  // Date selection styles
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  
  // Search button styles
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#007AFF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  
  // Initial state styles
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  initialStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  initialStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  initialStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  mockDataNotice: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  mockDataText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  tryAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // ML Features Styles
  mlActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  mlButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  mlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  connectionText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  testConnectionText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  mlBadge: {
    backgroundColor: '#ff9800',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
});