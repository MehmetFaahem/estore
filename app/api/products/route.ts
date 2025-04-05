import { NextResponse, NextRequest } from 'next/server';
import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Experience superior audio with HuluLulu wireless headphones featuring advanced Bluetooth 5.0, 30-hour battery life, active noise cancellation reducing ambient sound by 98%, memory foam ear cushions, and compatibility with Siri and Google Assistant.',
    price: 199.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    inStock: true,
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Track your health and fitness with the HuluLulu smartwatch offering continuous heart rate and SpO2 monitoring, built-in GPS, water resistance up to 50 meters, customizable watch faces, and 7-day battery life for everyday use.',
    price: 299.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    inStock: true,
  },
  {
    id: '3',
    name: 'Leather Wallet',
    description: 'Crafted from premium full-grain Italian leather, the HuluLulu wallet includes RFID blocking technology, 8 card slots, 2 bill compartments, a slim and elegant design, and comes in classic brown and black finishes.',
    price: 49.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    inStock: true,
  },
  {
    id: '4',
    name: 'Sunglasses',
    description: 'Stylish and protective, these HuluLulu sunglasses feature polarized UV400 lenses, anti-reflective coating, a durable acetate frame with spring hinges, and include a hard case and cleaning cloth for convenient storage.',
    price: 129.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    inStock: false,
  },
  {
    id: '5',
    name: 'Running Shoes',
    description: 'Built for performance, HuluLulu running shoes combine breathable mesh uppers, responsive cushioning, anti-slip rubber soles, memory foam insoles, and reflective elements to keep you visible and comfortable on every run.',
    price: 89.99,
    category: 'footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    inStock: true,
  },
  {
    id: '6',
    name: 'Backpack',
    description: 'Designed for travel and everyday use, the HuluLulu backpack is made from durable water-resistant cordura, features a padded laptop sleeve, multiple organizational pockets, ergonomic straps, side bottle holders, and compression straps for secure packing.',
    price: 79.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    inStock: true,
  },
];


// Define segment configuration for static generation
export const dynamic = 'force-static';

// Create separate route handlers for different endpoints
export async function GET(request: NextRequest) {
  // Get the URL to parse parameters manually instead of using searchParams
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  // For the base products endpoint, return all products
  if (url.pathname === '/api/products' || url.pathname === '/api/products/') {
    return NextResponse.json(products);
  }
  
  // If we have an ID in the path, return the specific product
  if (id && id !== 'products') {
    const product = products.find(p => p.id === id);
    return NextResponse.json(product || { error: 'Product not found' });
  }
  
  // Fallback to returning all products
  return NextResponse.json(products);
}