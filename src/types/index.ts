export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS';
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS';
  name?: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}
