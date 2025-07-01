export interface Session {
  jwt: string,
}
export interface Address {
  id: string,
  name: string,
  longitude: number,
  latitude: number,
}
export interface User {
  id: string,
  fullName: string,
  email: string,
  favourites: number[],
}
export interface Category {
  id: string;
  name: string;
  slug: string;
}
export interface Order {
  id: string,
  user: User,
  vendor: Vendor,
  condition: number,
  products: [],
  price: number,
}
export interface Vendor {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  closingHours: string;
  products: Product[];
}
export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: string;
  onSale: boolean;
  vendor: Vendor;
  stock: number | null;
}
export interface CartItem {
  product: Product,
  quantity: number
}

export interface Cart {
  products: CartItem[]
}