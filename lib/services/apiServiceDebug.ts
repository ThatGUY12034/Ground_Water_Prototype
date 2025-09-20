// services/apiServiceDebug.ts
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

class ApiServiceDebug {
  private baseUrl = 'https://indiawris.gov.in/Dataset/Ground Water Level';

  private async makeRequest(params: ApiParams): Promise<{response: Response, url: string}> {
    // Build query parameters carefully
    const queryParams = new URLSearchParams();
    
    // Required parameters
    queryParams.append('stateName', params.stateName);
    queryParams.append('startdate', params.startdate);
    queryParams.append('enddate', params.enddate);
    
    // Default parameters
    queryParams.append('agencyName', params.agencyName || 'CGWB');
    queryParams.append('download', params.download || 'false');
    queryParams.append('page', (params.page || 0).toString());
    queryParams.append('size', (params.size || 50).toString());
    
    // Optional parameters - only add if they have values
    if (params.districtName && params.districtName.trim() !== '') {
      queryParams.append('districtName', params.districtName);
    }

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    console.log('🔍 Request URL:', url);
    console.log('📋 Query params:', Object.fromEntries(queryParams.entries()));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return { response, url };
  }

  async fetchGroundWaterData(params: ApiParams): Promise<GroundWaterRecord[]> {
    try {
      console.log('🚀 Starting API request with params:', params);
      
      const { response, url } = await this.makeRequest(params);
      
      console.log('📨 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Try to get more details from the response
        let errorBody = '';
        try {
          errorBody = await response.text();
          console.log('❌ Error response body:', errorBody);
        } catch (e) {
          console.log('❌ Could not read error response body');
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}. URL: ${url}`);
      }

      const data: ApiResponse = await response.json();
      console.log('✅ API Response:', data);
      
      if (data.statusCode === 200 && data.message === 'Data fetched successfully') {
        console.log(`📊 Successfully fetched ${data.data.length} records`);
        return data.data;
      } else {
        throw new Error(`API Error: ${data.message} (Status: ${data.statusCode})`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('💥 API Service Error:', error.message);
        throw error;
      } else {
        console.error('💥 API Service Error:', error);
        throw new Error(String(error));
      }
    }
  }

  // Test with different parameter combinations
  async testVariousParameters() {
    const testCases = [
      {
        name: 'Basic test - Odisha with district',
        params: {
          stateName: 'Odisha',
          districtName: 'Baleshwar',
          startdate: '2024-01-01',
          enddate: '2024-01-02',
          size: 2
        }
      },
      {
        name: 'Basic test - Odisha without district',
        params: {
          stateName: 'Odisha',
          startdate: '2024-01-01',
          enddate: '2024-01-02',
          size: 2
        }
      },
      {
        name: 'Test with different state',
        params: {
          stateName: 'Punjab',
          startdate: '2024-01-01',
          enddate: '2024-01-02',
          size: 2
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      try {
        const result = await this.fetchGroundWaterData(testCase.params as ApiParams);
        console.log(`✅ SUCCESS: ${result.length} records`);
        break; // Stop at first success
      } catch (error) {
        if (error instanceof Error) {
          console.log(`❌ FAILED: ${error.message}`);
        } else {
          console.log(`❌ FAILED: ${String(error)}`);
        }
      }
    }
  }
}

export const apiServiceDebug = new ApiServiceDebug();