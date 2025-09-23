// components/WaterLevelChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface WaterLevelChartProps {
  data: Array<{ date: string; level: number }>;
  stationName: string;
}

export const WaterLevelChart: React.FC<WaterLevelChartProps> = ({ data, stationName }) => {
  const chartHeight = 150;
  const maxLevel = Math.max(...data.map(d => Math.abs(d.level))) * 1.2;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Level Trend - {stationName}</Text>
      
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Zero line */}
        <View style={[styles.zeroLine, { top: chartHeight / 2 }]} />
        
        {data.slice(-10).map((point, index) => (
          <View key={index} style={styles.dataPoint}>
            <View 
              style={[
                styles.levelBar,
                { 
                  height: (Math.abs(point.level) / maxLevel) * (chartHeight / 2),
                  top: point.level >= 0 ? (chartHeight / 2) - (Math.abs(point.level) / maxLevel) * (chartHeight / 2) 
                                       : chartHeight / 2,
                  backgroundColor: point.level >= 0 ? '#4caf50' : '#f44336'
                }
              ]} 
            />
            <Text style={styles.dateLabel}>
              {new Date(point.date).getDate()}/{new Date(point.date).getMonth() + 1}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4caf50' }]} />
          <Text style={styles.legendText}>Above Surface</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Below Surface</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  zeroLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#999',
  },
  dataPoint: {
    alignItems: 'center',
    flex: 1,
  },
  levelBar: {
    width: 8,
    borderRadius: 2,
    position: 'absolute',
  },
  dateLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#666',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});