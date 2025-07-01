// mobile/lib/api.ts
import axios from "axios";
import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: false, // ✅ importante si tu backend no necesita cookies
  headers: {
    "Content-Type": "application/json"
  }
});