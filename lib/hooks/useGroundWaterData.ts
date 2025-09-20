// hooks/useGroundWaterData.ts
import { useState, useEffect, useCallback } from 'react';
import { GroundWaterRecord } from '../../components/WaterLevelCard';
import { ApiParams } from '../services/apiService';
import { apiService } from '../services/apiService';


export const useGroundWaterData = (initialParams: ApiParams) => {
  const [data, setData] = useState<GroundWaterRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ApiParams>(initialParams);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate parameters before making the request
      if (!params.stateName) {
        throw new Error('State name is required');
      }
      if (!params.startdate || !params.enddate) {
        throw new Error('Date range is required');
      }

      const result = await apiService.fetchGroundWaterData(params);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<ApiParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData,
    updateParams,
    params,
  };
};