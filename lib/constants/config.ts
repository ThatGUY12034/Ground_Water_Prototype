export const API_CONFIG = {
  BASE_URL: 'https://indiawris.gov.in/Dataset/Ground Water Level',
  DEFAULT_PARAMS: {
    agencyName: 'CGWB',
    download: 'false',
    page: 0,
    size: 50,
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

export const STATES = [
  'Odisha',
  'Punjab',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Uttar Pradesh',
];

export const ODISHA_DISTRICTS = [
  'Baleshwar',
  'Cuttack',
  'Khordha',
  'Puri',
  'Ganjam',
  'Sundargarh',
];