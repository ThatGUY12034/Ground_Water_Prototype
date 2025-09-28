// hooks/useGroundWaterData.ts
import { useState, useCallback, useMemo } from 'react';
import { GroundWaterRecord } from '../../components/WaterLevelCard';
import { ApiParams } from '../services/apiService';
import { apiService } from '../services/apiService';

// Enhanced Statistics interface with ML data
export interface DataStatistics {
  totalRecords: number;
  uniqueStations: number;
  averageLevel: number;
  minLevel: number;
  maxLevel: number;
  dateRange: {
    start: string;
    end: string;
  } | null;
  stations: string[];
  // New ML statistics
  mlPredictionsAvailable: boolean;
  usingPythonApi: boolean;
}

// Enhanced record with ML predictions
export interface EnhancedGroundWaterRecord extends GroundWaterRecord {
  ml_prediction?: number;
  prediction_confidence?: number;
}

// Hook return interface
export interface UseGroundWaterDataReturn {
  // Core state
  data: EnhancedGroundWaterRecord[];
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
  usingPythonApi: boolean;
  
  // Parameters
  params: ApiParams;
  
  // Actions
  fetchData: () => Promise<void>;
  updateParams: (newParams: Partial<ApiParams>) => void;
  resetData: () => void;
  clearError: () => void;
  testPythonApi: () => Promise<boolean>;
  trainMLModel: () => Promise<any>;
  
  // Computed values
  hasData: boolean;
  totalStations: number;
  averageWaterLevel: number;
  
  // Data statistics
  statistics: DataStatistics;
  
  // Filtering utilities
  filterByStation: (stationCode: string) => EnhancedGroundWaterRecord[];
  getStationsList: () => Array<{ code: string; name: string }>;
  
  // ML specific
  recordsWithPredictions: EnhancedGroundWaterRecord[];
  hasMLPredictions: boolean;
}

export const useGroundWaterData = (initialParams: ApiParams): UseGroundWaterDataReturn => {
  const [data, setData] = useState<EnhancedGroundWaterRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ApiParams>(initialParams);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [usingPythonApi, setUsingPythonApi] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      setUsingPythonApi(false);
      
      // Validate parameters before making the request
      if (!params.stateName) {
        throw new Error('State name is required');
      }

      if (!params.startdate || !params.enddate) {
        throw new Error('Date range is required');
      }

      console.log('📡 Fetching data via Python API...');
      const result = await apiService.fetchGroundWaterData(params);
      console.log('✅ Data received:', result.length, 'records');

      // Check if we have ML predictions (indicates Python API was used)
      const hasMLPredictions = result.some(record => (record as any).ml_prediction !== undefined);
      setUsingPythonApi(hasMLPredictions);

      setData(result as EnhancedGroundWaterRecord[]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setData([]);
      setUsingMockData(true);
      setUsingPythonApi(false);
      
      console.error('❌ Error fetching groundwater data:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateParams = useCallback((newParams: Partial<ApiParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const resetData = useCallback(() => {
    setData([]);
    setError(null);
    setUsingMockData(false);
    setUsingPythonApi(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const testPythonApi = useCallback(async (): Promise<boolean> => {
    const result = await apiService.testPythonApiConnection();
    return result.connected;
  }, []);

  const trainMLModel = useCallback(async (): Promise<any> => {
    return await apiService.trainMLModel();
  }, []);

  // Filter data by station code
  const filterByStation = useCallback((stationCode: string): EnhancedGroundWaterRecord[] => {
    return data.filter(record => record.stationCode === stationCode);
  }, [data]);

  // Get unique stations list
  const getStationsList = useCallback((): Array<{ code: string; name: string }> => {
    const uniqueStations = new Map();
    data.forEach(record => {
      if (!uniqueStations.has(record.stationCode)) {
        uniqueStations.set(record.stationCode, {
          code: record.stationCode,
          name: record.stationName
        });
      }
    });
    return Array.from(uniqueStations.values());
  }, [data]);

  // Computed values using useMemo for performance
  const hasData = useMemo(() => data.length > 0, [data]);
  
  const totalStations = useMemo(() => {
    return new Set(data.map(item => item.stationCode)).size;
  }, [data]);

  const averageWaterLevel = useMemo(() => {
    return hasData 
      ? data.reduce((sum, item) => sum + item.dataValue, 0) / data.length 
      : 0;
  }, [data, hasData]);

  // ML specific computed values
  const recordsWithPredictions = useMemo(() => {
    return data.filter(record => record.ml_prediction !== undefined);
  }, [data]);

  const hasMLPredictions = useMemo(() => {
    return recordsWithPredictions.length > 0;
  }, [recordsWithPredictions]);

  // Comprehensive statistics
  const statistics = useMemo((): DataStatistics => {
    if (!hasData) {
      return {
        totalRecords: 0,
        uniqueStations: 0,
        averageLevel: 0,
        minLevel: 0,
        maxLevel: 0,
        dateRange: null,
        stations: [],
        mlPredictionsAvailable: false,
        usingPythonApi: false
      };
    }

    const levels = data.map(item => item.dataValue);
    const dates = data.map(item => item.dataTime).sort();
    const stations = Array.from(new Set(data.map(item => item.stationName)));

    return {
      totalRecords: data.length,
      uniqueStations: totalStations,
      averageLevel: parseFloat(averageWaterLevel.toFixed(2)),
      minLevel: parseFloat(Math.min(...levels).toFixed(2)),
      maxLevel: parseFloat(Math.max(...levels).toFixed(2)),
      dateRange: {
        start: dates[0],
        end: dates[dates.length - 1]
      },
      stations,
      mlPredictionsAvailable: hasMLPredictions,
      usingPythonApi
    };
  }, [data, hasData, totalStations, averageWaterLevel, hasMLPredictions, usingPythonApi]);

  return {
    // Core state
    data,
    loading,
    error,
    usingMockData,
    usingPythonApi,
    
    // Parameters
    params,
    
    // Actions
    fetchData,
    updateParams,
    resetData,
    clearError,
    testPythonApi,
    trainMLModel,
    
    // Computed values
    hasData,
    totalStations,
    averageWaterLevel,
    
    // Data statistics
    statistics,
    
    // Filtering utilities
    filterByStation,
    getStationsList,
    
    // ML specific
    recordsWithPredictions,
    hasMLPredictions
  };
};

// Quick hook for simple usage
export const useSimpleGroundWaterData = () => {
  return useGroundWaterData({
    stateName: '',
    districtName: '',
    startdate: '',
    enddate: '',
    size: 30
  });
};