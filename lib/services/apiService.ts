// services/apiService.ts
import { GroundWaterRecord } from '../../components/WaterLevelCard';
import { Platform } from 'react-native';

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
  // MANUAL CONFIGURATION - CHOOSE ONE BASED ON YOUR PLATFORM:
  
  // For WEB BROWSER - use this:
  private baseUrl: string = 'http://localhost:8000';
  
  // For ANDROID - use this instead:
  // private baseUrl: string = 'http://10.0.2.2:8000';
  
  // For iOS - use this instead:
  // private baseUrl: string = 'http://localhost:8000';

  private async testConnection(): Promise<boolean> {
    try {
      console.log(`🔗 Testing: ${this.baseUrl}`);
      const response = await fetch(`${this.baseUrl}/api/status`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ API CONNECTED: ${this.baseUrl}`);
        return true;
      }
    } catch (error) {
      console.log(`❌ Cannot reach: ${this.baseUrl}`);
    }
    return false;
  }

  async fetchGroundWaterData(params: ApiParams): Promise<GroundWaterRecord[]> {
    console.log(`📱 Platform: ${Platform.OS}, Trying: ${this.baseUrl}`);
    
    const isConnected = await this.testConnection();

    if (!isConnected) {
      console.log('📊 Using enhanced mock data (API unavailable)');
      return this.getEnhancedMockData(params.stateName, params.districtName);
    }

    console.log('🚀 Fetching REAL WRIS data from Python API...');

    try {
      const requestBody = {
        state: params.stateName,
        district: params.districtName || '',
        start_date: params.startdate,
        end_date: params.enddate
      };

      const response = await fetch(`${this.baseUrl}/api/fetch-groundwater-data`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we got real WRIS data or fallback data
      const recordCount = data.wrs_data?.length || 0;
      const dataSource = data.metadata?.data_source || 'unknown';
      
      console.log(`✅ ${dataSource === 'wrs_api' ? 'REAL WRIS' : 'FALLBACK'} data: ${recordCount} records`);

      const records = data.wrs_data || [];
      if (data.ml_predictions?.predictions) {
        records.forEach((record: any, index: number) => {
          record.ml_prediction = data.ml_predictions.predictions[index];
        });
      }

      return records;

    } catch (error) {
      console.log('📊 API call failed, using mock data');
      return this.getEnhancedMockData(params.stateName, params.districtName);
    }
  }

  async testPythonApiConnection(): Promise<{connected: boolean; url: string; platform: string}> {
    const isConnected = await this.testConnection();
    return {
      connected: isConnected,
      url: this.baseUrl,
      platform: Platform.OS
    };
  }

  async trainMLModel(): Promise<any> {
    const isConnected = await this.testConnection();
    
    if (!isConnected) {
      return {
        message: "API not reachable - using mock mode",
        status: "info",
        platform: Platform.OS
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/train-model`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      return {
        message: "Training failed",
        status: "error"
      };
    }
  }

  // Enhanced mock data (keep your existing)
  private async getEnhancedMockData(stateName: string, districtName?: string): Promise<GroundWaterRecord[]> {
    console.log('🎭 Generating realistic mock data for:', stateName, districtName);
    // ... your existing mock data implementation
    return []; // Your mock data
  }
}

export const apiService = new ApiService();