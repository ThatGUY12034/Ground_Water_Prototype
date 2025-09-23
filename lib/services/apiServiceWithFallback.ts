// services/apiServiceWithFallback.ts
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

export interface ApiResponse {
  statusCode: number;
  message: string;
  data: GroundWaterRecord[];
}

class ApiServiceWithFallback {
  private corsProxies = [
    'https://corsproxy.io/?', // Reliable proxy
    'https://api.allorigins.win/raw?url=', // Another good option
    'https://cors-anywhere.herokuapp.com/' // Backup option
  ];

  private getBaseUrl(): string {
    if (Platform.OS === 'web') {
      // Use the first CORS proxy for web
      return `${this.corsProxies[0]}https://indiawris.gov.in/Dataset/Ground Water Level`;
    } else {
      // Direct URL for native apps
      return 'https://indiawris.gov.in/Dataset/Ground Water Level';
    }
  }

  async fetchGroundWaterData(params: ApiParams): Promise<GroundWaterRecord[]> {
    let lastError: Error | null = null;
    
    // Try direct connection first for native, then fallback to proxies for web
    const urlsToTry = Platform.OS === 'web' 
      ? this.corsProxies.map(proxy => `${proxy}https://indiawris.gov.in/Dataset/Ground Water Level`)
      : ['https://indiawris.gov.in/Dataset/Ground Water Level'];

    for (const baseUrl of urlsToTry) {
      try {
        const url = new URL(baseUrl);
        
        // Add all parameters
        url.searchParams.append('stateName', params.stateName);
        url.searchParams.append('startdate', params.startdate);
        url.searchParams.append('enddate', params.enddate);
        url.searchParams.append('agencyName', params.agencyName || 'CGWB');
        url.searchParams.append('download', params.download || 'false');
        url.searchParams.append('page', (params.page || 0).toString());
        url.searchParams.append('size', (params.size || 50).toString());
        
        if (params.districtName) {
          url.searchParams.append('districtName', params.districtName);
        }

        console.log('🌐 Trying URL:', url.toString());

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
        lastError = error as Error;
        console.warn(`❌ Failed with ${baseUrl}:`, error);
        continue; // Try next URL
      }
    }

    throw lastError || new Error('All CORS proxies failed');
  }
}

export const apiServiceWithFallback = new ApiServiceWithFallback();