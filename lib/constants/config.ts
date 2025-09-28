// lib/constants/config.ts
import { getAllStates, getDistricts as fetchDistricts } from "india-state-district";

export const API_CONFIG = {
  BASE_URL: "https://indiawris.gov.in/Dataset/Ground Water Level",
  DEFAULT_PARAMS: {
    agencyName: "CGWB",
    download: "false",
    page: 0,
    size: 50,
  },
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};

// Complete district list for all major Indian states
export const RELIABLE_DISTRICTS: { [key: string]: string[] } = {
  'Odisha': [
    'Baleshwar', 'Cuttack', 'Khordha', 'Puri', 'Ganjam', 'Sundargarh', 
    'Kendujhar', 'Mayurbhanj', 'Bhadrak', 'Jajpur', 'Kendrapara', 'Dhenkanal',
    'Angul', 'Nayagarh', 'Gajapati', 'Kandhamal', 'Baudh', 'Sonepur',
    'Balangir', 'Nuapada', 'Kalahandi', 'Rayagada', 'Nabarangpur', 'Koraput',
    'Malkangiri', 'Jagatsinghapur'
  ],
  'Andhra Pradesh': [
    'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 
    'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam',
    'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Karnataka': [
    'Bangalore Urban', 'Bangalore Rural', 'Belagavi', 'Ballari', 'Bidar',
    'Vijayapura', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Kalaburagi',
    'Hassan', 'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru',
    'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
    'Yadgir'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul',
    'Thanjavur', 'Ranipet', 'Sivaganga', 'Karur', 'Kanchipuram',
    'Kanyakumari', 'Madurai', 'Nagapattinam', 'Namakkal', 'Perambalur',
    'Pudukkottai', 'Ramanathapuram', 'Thanjavur', 'Theni', 'Tirupur',
    'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad',
    'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon',
    'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani',
    'Jalna', 'Bhandara', 'Gondia', 'Wardha', 'Yavatmal', 'Buldhana',
    'Washim', 'Hingoli', 'Nandurbar', 'Raigad', 'Ratnagiri', 'Sindhudurg'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
    'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda',
    'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
    'Tapi', 'Vadodara', 'Valsad'
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur',
    'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
    'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore',
    'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur',
    'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi',
    'Sri Ganganagar', 'Tonk', 'Udaipur'
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
    'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur',
    'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor',
    'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
    'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar',
    'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur',
    'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
    'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
    'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad',
    'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Rae Bareli', 'Rampur',
    'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli',
    'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
    'Unnao', 'Varanasi'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat',
    'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur',
    'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori',
    'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur',
    'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur',
    'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh',
    'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol',
    'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh',
    'Ujjain', 'Umaria', 'Vidisha'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
    'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong',
    'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
    'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur',
    'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
    'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
    'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
    'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar',
    'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot',
    'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur',
    'Shahid Bhagat Singh Nagar', 'Tarn Taran'
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad',
    'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal',
    'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula',
    'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi',
    'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi',
    'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
    'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
    'Medak', 'Medchal–Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Nirmal',
    'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy',
    'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural',
    'Warangal Urban', 'Yadadri Bhuvanagiri'
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
    'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj',
    'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj',
    'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur',
    'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
    'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul',
    'Vaishali', 'West Champaran'
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo',
    'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao',
    'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup',
    'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
    'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
    'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
    'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
    'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
    'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
    'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu',
    'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
    'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa',
    'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya',
    'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon',
    'Sukma', 'Surajpur', 'Surguja'
  ]
};

// All Indian states - try package first, then fallback
export const STATES: string[] = (() => {
  try {
    const packageStates = getAllStates().map(state => state.name);
    console.log('📦 Package states loaded:', packageStates.length, 'states');
    return packageStates.length > 0 ? packageStates : Object.keys(RELIABLE_DISTRICTS);
  } catch (error) {
    console.log('📦 Using enhanced state list');
    return Object.keys(RELIABLE_DISTRICTS);
  }
})();

// Enhanced district function with better fallbacks
export const getDistricts = (state: string): string[] => {
  console.log(`🔍 Getting districts for: "${state}"`);
  
  // First try our reliable district list
  const reliableDistricts = RELIABLE_DISTRICTS[state];
  if (reliableDistricts && reliableDistricts.length > 0) {
    console.log(`✅ Using reliable districts for "${state}": ${reliableDistricts.length} districts`);
    return reliableDistricts;
  }
  
  // Try the package as fallback
  try {
    const packageDistricts = fetchDistricts(state) || [];
    if (packageDistricts.length > 0) {
      console.log(`📦 Using package districts for "${state}": ${packageDistricts.length} districts`);
      return packageDistricts;
    }
  } catch (error) {
    console.log(`📦 Package failed for "${state}"`);
  }
  
  // Final fallback - generic districts
  console.warn(`⚠️ Using fallback districts for: "${state}"`);
  return [
    `${state} District 1`,
    `${state} District 2`, 
    `${state} District 3`
  ];
};

// Debug: Log available states and their districts
console.log('🏛️ Enhanced Config Loaded:');
console.log(`📍 Total states: ${STATES.length}`);
console.log(`📍 States with reliable districts: ${Object.keys(RELIABLE_DISTRICTS).length}`);

// Log states with district counts
STATES.slice(0, 10).forEach(state => { // Show first 10 to avoid console spam
  const districts = getDistricts(state);
  console.log(`📍 ${state}: ${districts.length} districts`);
});