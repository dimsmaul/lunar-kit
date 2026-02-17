/**
 * Environment configuration
 *
 * Type-safe access to environment variables using Expo Constants.
 * 
 * Usage:
 * ```ts
 * import { env } from '@/lib/env';
 * console.log(env.API_URL);
 * ```
 */
import Constants from 'expo-constants';

interface Env {
  API_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  [key: string]: string;
}

function getEnv(): Env {
  const extra = Constants.expoConfig?.extra || {};

  return {
    API_URL: extra.API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    APP_ENV: extra.APP_ENV || process.env.EXPO_PUBLIC_APP_ENV || 'development',
    ...Object.keys(process.env)
      .filter(key => key.startsWith('EXPO_PUBLIC_'))
      .reduce((acc, key) => {
        acc[key.replace('EXPO_PUBLIC_', '')] = process.env[key] || '';
        return acc;
      }, {} as Record<string, string>),
  };
}

export const env = getEnv();

/**
 * Check if current environment matches
 */
export const isDev = env.APP_ENV === 'development';
export const isStaging = env.APP_ENV === 'staging';
export const isProd = env.APP_ENV === 'production';
