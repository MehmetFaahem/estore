import { NextResponse, NextRequest } from 'next/server';
import type { Product } from '@/lib/types';

// Import the products data from the parent route
import { products } from '../route';

// This route is dynamic and handles search queries
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query')?.toLowerCase();
  
  // If a search query is provided, filter products
  if (query) {
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
    return NextResponse.json(filteredProducts);
  }
  
  // If no query, return all products
  return NextResponse.json(products);
}