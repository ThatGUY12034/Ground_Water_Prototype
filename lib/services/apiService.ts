// services/apiService.ts
import { GroundWaterRecord } from '../../components/WaterLevelCard';

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

export interface ApiResponse {
  statusCode: number;
  message: string;
  data: GroundWaterRecord[];
}

class ApiService {
  private baseUrl = 'https://indiawris.gov.in/Dataset/Ground Water Level';

  async fetchGroundWaterData(params: ApiParams): Promise<GroundWaterRecord[]> {
    try {
      // Build URL with URLSearchParams for proper encoding
      const url = new URL(this.baseUrl);
      
      // Required parameters
      url.searchParams.append('stateName', params.stateName);
      url.searchParams.append('startdate', params.startdate);
      url.searchParams.append('enddate', params.enddate);
      
      // Optional parameters with defaults
      url.searchParams.append('agencyName', params.agencyName || 'CGWB');
      url.searchParams.append('download', params.download || 'false');
      url.searchParams.append('page', (params.page || 0).toString());
      url.searchParams.append('size', (params.size || 50).toString());
      
      // Optional district parameter
      if (params.districtName) {
        url.searchParams.append('districtName', params.districtName);
      }

      console.log('🌐 API Request:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.statusCode === 200) {
        return data.data;
      } else {
        throw new Error(`API Error: ${data.message}`);
      }

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();