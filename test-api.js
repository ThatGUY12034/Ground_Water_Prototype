// test-simple.js - Simple test without dependencies
async function testAPI() {
  try {
    console.log('Testing India WRIS API...');
    
    // Build URL manually
    const params = {
      stateName: 'Odisha',
      districtName: 'Baleshwar',
      agencyName: 'CGWB',
      startdate: '2024-01-01',
      enddate: '2024-01-02',
      download: 'false',
      page: '0',
      size: '5'
    };

    const baseUrl = 'https://indiawris.gov.in/Dataset/Ground%20Water%20Level';
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}?${queryString}`;
    
    console.log('URL:', url);
    
    const response = await post(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success! Data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();