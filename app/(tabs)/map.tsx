// app/(tabs)/map.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useGroundWaterData } from '../../lib/hooks/useGroundWaterData';
import { GroundWaterRecord } from '../../components/WaterLevelCard';

// Default coordinates for Odisha, India
const ODISHA_REGION = {
  latitude: 20.9517,
  longitude: 85.0985,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

// Mock station data for prototyping (in case API fails)
const MOCK_STATIONS: GroundWaterRecord[] = [
  {
    stationCode: 'CGWBHU2326',
    stationName: 'Mukteswar',
    stationType: 'Ground Water',
    latitude: 21.2394,
    longitude: 86.7283,
    agencyName: 'CGWB',
    state: 'Odisha',
    district: 'Baleshwar',
    dataValue: -2.58,
    dataTime: '2024-01-12T18:00:00',
    wellType: 'Bore Well',
    wellDepth: 112.0,
    wellAquiferType: 'Confined',
    description: 'GPRS-Water Level',
    unit: 'm'
  },
  {
    stationCode: 'CGWBHU2327',
    stationName: 'Pratappur_3',
    stationType: 'Ground Water',
    latitude: 22.0042,
    longitude: 87.4608,
    agencyName: 'CGWB',
    state: 'Odisha',
    district: 'Baleshwar',
    dataValue: -12.74,
    dataTime: '2024-01-01T00:00:00',
    wellType: 'Bore Well',
    wellDepth: 201.0,
    wellAquiferType: 'Confined',
    description: 'GPRS-Water Level',
    unit: 'm'
  },
  {
    stationCode: 'CGWBHU2328',
    stationName: 'Balasore Central',
    stationType: 'Ground Water',
    latitude: 21.4942,
    longitude: 86.9333,
    agencyName: 'CGWB',
    state: 'Odisha',
    district: 'Baleshwar',
    dataValue: -8.32,
    dataTime: '2024-01-15T12:00:00',
    wellType: 'Bore Well',
    wellDepth: 156.0,
    wellAquiferType: 'Confined',
    description: 'GPRS-Water Level',
    unit: 'm'
  },
  {
    stationCode: 'CGWBHU2329',
    stationName: 'Soro',
    stationType: 'Ground Water',
    latitude: 21.2855,
    longitude: 86.6889,
    agencyName: 'CGWB',
    state: 'Odisha',
    district: 'Baleshwar',
    dataValue: -15.45,
    dataTime: '2024-01-10T09:00:00',
    wellType: 'Bore Well',
    wellDepth: 189.0,
    wellAquiferType: 'Confined',
    description: 'GPRS-Water Level',
    unit: 'm'
  }
];

export default function MapScreen() {
  const [selectedStation, setSelectedStation] = useState<GroundWaterRecord | null>(null);
  const [mapRegion, setMapRegion] = useState(ODISHA_REGION);
  const [usingMockData, setUsingMockData] = useState(false);

  // Try to fetch real data, fallback to mock data
  const { data, loading, error } = useGroundWaterData({
    stateName: 'Odisha',
    startdate: '2024-01-01',
    enddate: '2024-01-31',
    size: 50,
  });

  // Use real data if available, otherwise use mock data
  const stations = data.length > 0 ? data : MOCK_STATIONS;
  const uniqueStations = stations.filter((station, index, self) =>
    index === self.findIndex((s) => s.stationCode === station.stationCode)
  );

  useEffect(() => {
    if (data.length === 0 && !loading) {
      setUsingMockData(true);
    }
  }, [data, loading]);

  // Get water level color based on depth
  const getWaterLevelColor = (level: number) => {
    if (level > -5) return '#4CAF50'; // Good (green)
    if (level > -10) return '#FFC107'; // Moderate (yellow)
    if (level > -15) return '#FF9800'; // Concerning (orange)
    return '#F44336'; // Critical (red)
  };

  const getWaterLevelStatus = (level: number) => {
    if (level > -5) return 'Good';
    if (level > -10) return 'Moderate';
    if (level > -15) return 'Concerning';
    return 'Critical';
  };

  const getMarkerEmoji = (level: number) => {
    if (level > -5) return '💧'; // Good
    if (level > -10) return '⚠️'; // Moderate
    if (level > -15) return '🚨'; // Concerning
    return '🔥'; // Critical
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Groundwater Station Map</Text>
      
      {usingMockData && (
        <View style={styles.mockNotice}>
          <Text style={styles.mockNoticeText}>
            📋 Using demo station data for prototype
          </Text>
        </View>
      )}

      {/* Map Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{uniqueStations.length}</Text>
          <Text style={styles.statLabel}>Stations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {uniqueStations.filter(s => s.dataValue > -10).length}
          </Text>
          <Text style={styles.statLabel}>Safe</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {uniqueStations.filter(s => s.dataValue <= -10).length}
          </Text>
          <Text style={styles.statLabel}>Alert</Text>
        </View>
      </View>

      {/* Map Container - Made smaller to give more space to details */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {uniqueStations.map((station) => (
            <Marker
              key={station.stationCode}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              onPress={() => setSelectedStation(station)}
            >
              <View style={[
                styles.markerContainer,
                { borderColor: getWaterLevelColor(station.dataValue) }
              ]}>
                <Text style={styles.markerEmoji}>
                  {getMarkerEmoji(station.dataValue)}
                </Text>
                <Text style={styles.markerText}>
                  {station.dataValue.toFixed(1)}m
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          👆 Tap on markers to see station details
        </Text>
      </View>

      {/* Main Content Area - Now uses Flex to take remaining space */}
      <View style={styles.contentArea}>
        {selectedStation ? (
          <ScrollView style={styles.stationDetails} showsVerticalScrollIndicator={true}>
            <Text style={styles.stationName}>{selectedStation.stationName}</Text>
            <Text style={styles.stationLocation}>
              {selectedStation.district}, {selectedStation.state}
            </Text>
            
            {/* Water Level Status Card */}
            <View style={styles.waterLevelCard}>
              <View style={[
                styles.levelStatus, 
                { backgroundColor: getWaterLevelColor(selectedStation.dataValue) }
              ]}>
                <Text style={styles.levelStatusText}>
                  {getWaterLevelStatus(selectedStation.dataValue)} WATER LEVEL
                </Text>
              </View>
              <Text style={styles.waterLevelValue}>
                {selectedStation.dataValue.toFixed(2)} meters below surface
              </Text>
              <Text style={styles.waterLevelDescription}>
                {selectedStation.dataValue > -5 ? 'Normal groundwater conditions' :
                 selectedStation.dataValue > -10 ? 'Moderate depletion observed' :
                 selectedStation.dataValue > -15 ? 'Concerning depletion level' :
                 'Critical water level - Immediate attention needed'}
              </Text>
            </View>
            
            {/* Station Details Grid */}
            <Text style={styles.sectionTitle}>Station Information</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Station Code</Text>
                <Text style={styles.detailValue}>{selectedStation.stationCode}</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Well Depth</Text>
                <Text style={styles.detailValue}>{selectedStation.wellDepth} meters</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Well Type</Text>
                <Text style={styles.detailValue}>{selectedStation.wellType}</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Aquifer Type</Text>
                <Text style={styles.detailValue}>{selectedStation.wellAquiferType}</Text>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Last Update</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedStation.dataTime).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Monitoring Agency</Text>
                <Text style={styles.detailValue}>{selectedStation.agencyName}</Text>
              </View>
            </View>

            {/* Recommendations based on water level */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>💡 Recommendations</Text>
              <Text style={styles.recommendationText}>
                {selectedStation.dataValue > -5 ? 
                  'Continue current water management practices. Conditions are stable.' :
                selectedStation.dataValue > -10 ?
                  'Monitor closely. Consider water conservation measures in the area.' :
                selectedStation.dataValue > -15 ?
                  'Implement water conservation measures. Review extraction patterns.' :
                  'Critical situation. Immediate water management intervention required.'}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noSelection}>
            <Text style={styles.noSelectionEmoji}>🗺️</Text>
            <Text style={styles.noSelectionTitle}>Select a Station</Text>
            <Text style={styles.noSelectionText}>
              Tap on any marker on the map to view detailed information about that groundwater monitoring station.
            </Text>
          </View>
        )}
      </View>

      {/* Legend - Moved to bottom */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Water Level Status Guide</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>💧</Text>
            <Text style={styles.legendText}>Good ({'> -5m'})</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>⚠️</Text>
            <Text style={styles.legendText}>Moderate (-5m to -10m)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>🚨</Text>
            <Text style={styles.legendText}>Concerning (-10m to -15m)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendEmoji}>🔥</Text>
            <Text style={styles.legendText}>Critical ({'< -15m'})</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

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
  mockNotice: {
    backgroundColor: '#fff3e0',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  mockNoticeText: {
    fontSize: 12,
    color: '#e65100',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  mapContainer: {
    height: height * 0.2, // Reduced height to give more space to details
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  instructions: {
    padding: 8,
    marginHorizontal: 16,
  },
  instructionsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contentArea: {
    flex: 1, // Takes remaining space
    marginHorizontal: 16,
    marginBottom: 8,
  },
  stationDetails: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: height * 0.8, // Increased height
  },
  stationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stationLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  waterLevelCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  levelStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  levelStatusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  waterLevelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  waterLevelDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recommendationCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
  },
  noSelectionEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noSelectionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerEmoji: {
    fontSize: 16,
  },
  markerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  legendContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});