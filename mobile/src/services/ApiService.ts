import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://your-deployed-app.replit.app'; // Replace with your actual deployment URL

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCurrentGuruLocation() {
    return this.makeRequest('/api/guru-location');
  }

  async authenticateAdmin(token: string) {
    return this.makeRequest('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async updateGuruLocation(locationData: any, authToken: string) {
    return this.makeRequest('/api/admin/update-location', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(locationData),
    });
  }

  async registerDevice(deviceData: any) {
    return this.makeRequest('/api/device/register', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }
}

export default new ApiService();