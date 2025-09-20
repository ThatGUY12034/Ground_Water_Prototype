// services/apiService.ts
import axios from 'axios';
import { GroundWaterRecord } from '../../components/WaterLevelCard';

export const API_CONFIG = {
  BASE_URL: 'https://indiawris.gov.in/Dataset/Ground%20Water%20Level', // URL encoded
  DEFAULT_PARAMS: {
    agencyName: 'CGWB',
    download: 'false',
    page: '0',
    size: '50',
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

export interface ApiResponse {
  statusCode: number;
  message: string;
  data: GroundWaterRecord[];
}

export interface ApiParams {
  stateName: string;
  districtName?: string;
  agencyName?: string;
  startdate: string;
  enddate: string;
  download?: string;
  page?: number;
  size?: number;
}

class ApiService {
  private async makeRequest(params: ApiParams, retryCount = 0): Promise<ApiResponse> {
    try {
      // Build URL with query parameters manually to ensure proper formatting
      const baseUrl = API_CONFIG.BASE_URL;
      
      // Create URLSearchParams for proper encoding
      const queryParams = new URLSearchParams();
      
      // Required parameters
      queryParams.append('stateName', params.stateName);
      queryParams.append('startdate', params.startdate);
      queryParams.append('enddate', params.enddate);
      
      // Optional parameters with defaults
      queryParams.append('agencyName', params.agencyName || API_CONFIG.DEFAULT_PARAMS.agencyName);
      queryParams.append('download', params.download || API_CONFIG.DEFAULT_PARAMS.download);
      queryParams.append('page', (params.page || API_CONFIG.DEFAULT_PARAMS.page).toString());
      queryParams.append('size', (params.size || API_CONFIG.DEFAULT_PARAMS.size).toString());
      
      // Optional district parameter
      if (params.districtName && params.districtName.trim() !== '') {
        queryParams.append('districtName', params.districtName);
      }

      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log('🔗 Final URL:', url);

      // Use fetch instead of axios to avoid any axios-specific issues
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;

    } catch (error: any) {
      console.error('❌ API Request Error:', error.message);
      
      if (retryCount < API_CONFIG.RETRY_CONFIG.maxRetries) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${API_CONFIG.RETRY_CONFIG.maxRetries})`);
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_CONFIG.retryDelay * (retryCount + 1))
        );
        return this.makeRequest(params, retryCount + 1);
      }
      
      throw error;
    }
  }

  async fetchGroundWaterData(params: ApiParams): Promise<GroundWaterRecord[]> {
    try {
      console.log('🚀 Starting groundwater data fetch...');
      
      // Validate required parameters
      if (!params.stateName || params.stateName.trim() === '') {
        throw new Error('stateName parameter is required and cannot be empty');
      }
      if (!params.startdate || !params.enddate) {
        throw new Error('startdate and enddate parameters are required');
      }

      const response = await this.makeRequest(params);
      
      if (response.statusCode === 200 && response.message === 'Data fetched successfully') {
        console.log(`✅ Successfully fetched ${response.data.length} records`);
        return response.data;
      } else {
        throw new Error(`API Error: ${response.message}`);
      }
    } catch (error) {
      console.error('💥 API Service Error:', error);
      throw error;
    }
  }

  // Test function
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing API connection...');
      const testParams: ApiParams = {
        stateName: 'Odisha',
        startdate: '2024-01-01',
        enddate: '2024-01-02',
        size: 1,
      };

      const response = await this.makeRequest(testParams);
      const success = response.statusCode === 200;
      console.log(success ? '✅ Connection test passed' : '❌ Connection test failed');
      return success;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();