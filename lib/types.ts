export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  discountedTotal: number;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean | null;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  searchQuery?: string;
}