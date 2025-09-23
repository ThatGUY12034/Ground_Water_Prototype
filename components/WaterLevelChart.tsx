// components/WaterLevelChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WaterLevelChartProps {
  data: Array<{ date: string; level: number }>;
  stationName: string;
}

export const WaterLevelChart: React.FC<WaterLevelChartProps> = ({ data, stationName }) => {
  const chartHeight = 150;

  // find min and max level to scale properly
  const minLevel = Math.min(...data.map(d => d.level));
  const maxLevel = Math.max(...data.map(d => d.level));

  const range = Math.max(Math.abs(minLevel), Math.abs(maxLevel)) || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Level Trend - {stationName}</Text>

      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Zero line at baseline */}
        <View style={[styles.zeroLine, { bottom: chartHeight / 2 }]} />

        {data.slice(-10).map((point, index) => {
          const barHeight = (Math.abs(point.level) / range) * (chartHeight / 2);

          return (
            <View key={index} style={styles.dataPoint}>
              <View
                style={[
                  styles.levelBar,
                  {
                    height: barHeight,
                    bottom: chartHeight / 2, // baseline at zero
                    backgroundColor: point.level >= 0 ? '#4caf50' : '#f44336',
                    transform: [{ translateY: point.level >= 0 ? -barHeight : 0 }],
                  },
                ]}
              />
              <Text style={styles.dateLabel}>
                {new Date(point.date).getDate()}/{new Date(point.date).getMonth() + 1}
              </Text>
            </View>
          );
        })}
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
    position: 'relative',
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
    justifyContent: 'flex-end',
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
