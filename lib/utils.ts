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

// export function flattenAttributes(data: any): any {
//   // Check if data is a plain object; return as is if not
//   if (
//     typeof data !== "object" ||
//     data === null ||
//     data instanceof Date ||
//     typeof data === "function"
//   ) {
//     return data;
//   }

//   // If data is an array, apply flattenAttributes to each element and return as array
//   if (Array.isArray(data)) {
//     return data.map((item) => flattenAttributes(item));
//   }

//   // Initialize an object with an index signature for the flattened structure
//   let flattened = {};

//   // Iterate over each key in the object
//   for (let key in data) {
//     // Skip inherited properties from the prototype chain
//     if (!data.hasOwnProperty(key)) continue;

//     // If the key is 'attributes' or 'data', and its value is an object, merge their contents
//     if (
//       (key === "attributes" || key === "data") &&
//       typeof data[key] === "object" &&
//       !Array.isArray(data[key])
//     ) {
//       Object.assign(flattened, flattenAttributes(data[key]));
//     } else {
//       // For other keys, copy the value, applying flattenAttributes if it's an object
//       flattened[key] = flattenAttributes(data[key]);
//     }
//   }

//   return flattened;
// }

export function getStrapiURL() {
  return process.env.STRAPI_URL ?? "http://127.0.0.1:1337";
  // return "https://tap-cms-4a4db946442e.herokuapp.com";
}

export async function getAuthToken() {
  const authToken = await getStorageItemAsync('session');
  return authToken;
}