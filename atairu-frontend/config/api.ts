const configuredBaseUrl = process.env.EXPO_PUBLIC_BASE_URL?.trim();
const BASE_URL = (configuredBaseUrl || 'http://192.168.1.26:8080').replace(/\/+$/, '');

export default BASE_URL;