import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function setStorageItemAsync(key: string, value: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getStorageItemAsync(key: string) {
  if (Platform.OS === 'web') {
    try {
      const jsonValue = localStorage.getItem(key);
      return jsonValue !=null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    try {
      const jsonValue = await SecureStore.getItemAsync(key);
      return jsonValue !=null ? JSON.parse(jsonValue) : null
    }
    catch(error){
      throw error
    }
  }
}

export async function deleteStorageItemAsync(key: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
