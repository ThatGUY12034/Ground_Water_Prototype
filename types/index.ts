export interface GroundWaterRecord {
  stationCode: string;
  stationName: string;
  stationType: string;
  latitude: number;
  longitude: number;
  agencyName: string;
  state: string;
  district: string;
  dataValue: number;
  dataTime: string;
  wellType: string;
  wellDepth: number;
  wellAquiferType: string;
  description?: string;
  unit?: string;
}

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