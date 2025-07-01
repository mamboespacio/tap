import { getStorageItemAsync } from '@/hooks/useStorageState';
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return `${hour}:${minute}`;
}

import Constants from "expo-constants";

export function getStrapiURL() {
  return Constants.expoConfig?.extra?.strapiUrl ?? "http://127.0.0.1:1337";
}

export async function getAuthToken() {
  const authToken = await getStorageItemAsync('session');
  return authToken;
}