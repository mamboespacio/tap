import qs from 'qs';
import axios from 'axios';
import { getStrapiURL } from '@/lib/utils';
import { getStorageItemAsync } from '@/hooks/useStorageState';
import { api } from "./api";

const baseUrl = getStrapiURL();
const API_BASE = `${baseUrl}/api`; // ✅ ahora usa la URL dinámica

export async function getAllCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const { data } = await api.get(`/categories/${slug}`);
  return data;
}

export async function getAllProducts() {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product', error);
    throw error;
  }
}

export async function getAllVendors() {
  try {
    const res = await api.get("/vendors");
    return res.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
}

export async function getVendorById(id: number) {
  try {
    const res = await api.get(`/vendors/by-id/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    throw error;
  }
}

export async function getVendorsByProductCategory(slug: string) {
  try {
    const res = await api.get(`/vendors/by-category/${slug}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching vendors by product category:', error);
    throw error;
  }
}



export async function getAuthHeader() {
  const user = await getStorageItemAsync('user');
  const token = user?.jwt;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchData(url: string) {
  const user = await getStorageItemAsync('user');
  const authToken = user?.jwt;

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  try {
    const response = await fetch(url, headers);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const mutateData = async (
  method: 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  payload: any
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(await getAuthHeader())
    };

    const response = await axios({
      method,
      url: `${API_BASE}/${endpoint}`, // ✅ usa API_BASE dinámico
      headers,
      data: payload,
    });

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else {
      console.error("Network or other error:", error.message);
    }
    throw error;
  }
};

export interface GetProductsOptions {
  page?: number;
  pageSize?: number;
  sort?: string[];
  filters?: Record<string, any>;
  populate?: string[] | "*";
}

export async function getProducts(options: GetProductsOptions = {}) {
  const {
    page = 1,
    pageSize = 10,
    sort = ["name:desc"],
    filters = {},
    populate = "*",
  } = options;

  const query = qs.stringify({
    sort,
    pagination: { page, pageSize },
    filters,
    populate,
  }, { encodeValuesOnly: true });

  return fetchData(`${API_BASE}/products?${query}`);
}

export interface GetVendorsOptions {
  page?: number;
  pageSize?: number;
  sort?: string[];
  filters?: Record<string, any>;
  populate?: string[] | "*";
}

export async function getVendors(options: GetVendorsOptions = {}) {
  const {
    page = 1,
    pageSize = 10,
    sort = ["name:desc"],
    filters = {},
    populate = "*",
  } = options;

  const query = qs.stringify({
    sort,
    pagination: { page, pageSize },
    filters,
    populate,
  }, { encodeValuesOnly: true });

  return fetchData(`${API_BASE}/vendors?${query}`);
}

export async function getCategories() {
  const query = qs.stringify({ sort: ["name:desc"] });
  return fetchData(`${API_BASE}/categories?${query}`);
}

export async function getOrders() {
  const query = qs.stringify({
    sort: ["id:desc"],
    populate: ['vendor', 'users_permissions_user'],
  });
  return fetchData(`${API_BASE}/orders?${query}`);
}

export async function getAddresses(userId: string) {
  const query = qs.stringify({
    sort: ["name:desc"],
  });
  return fetchData(`${API_BASE}/addresses?${query}`);
}
export async function registerUser(email: string, password: string, fullName: string, dni: string) {
  try {
    const response = await axios.post(`${API_BASE}/auth/local/register`, {
      username: email, // Strapi requiere `username`, aunque uses email
      email,
      password,
      fullName,
      dni,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/local`, {
      identifier: email,
      password: password
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Login error:", error.response.data);
      return { error: true };
    }
    return null;
  }
};

export async function createPreference(title: string, qty: number, price: number, external_reference?: string) {
  try {
    const response = await fetch('https://tap-api.vercel.app/create_preference', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        quantity: qty,
        price,
        external_reference,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Preference creation error:", error);
    throw error;
  }
}
