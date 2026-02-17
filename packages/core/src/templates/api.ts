/**
 * API Client
 *
 * Pre-configured axios instance with interceptors for:
 * - Base URL from env config
 * - Auth token injection
 * - Error handling
 * - Request/response logging in dev
 *
 * Usage:
 * ```ts
 * import { api } from '@/lib/api';
 *
 * const users = await api.get('/users');
 * const user = await api.post('/users', { name: 'John' });
 * ```
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — inject auth token
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * Response interceptor — handle common errors
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired — clear auth
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      // TODO: Navigate to login or trigger auth refresh
    }
    return Promise.reject(error);
  },
);

/**
 * Auth helpers
 */
export async function setAuthToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}
