// This file handles static site generation parameters

import { Product } from "@/lib/types";

export async function generateStaticParams() {
  try {
    // Fetch all products to get their IDs
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
    
    // Check if the response is ok
    if (!res.ok) {
      console.error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      return [];
    }
    
    // Parse the JSON response safely
    const products = await res.json();
    
    // Validate that products is an array
    if (!Array.isArray(products)) {
      console.error('Products data is not an array:', typeof products);
      return [];
    }
    
    // Return an array of objects with the id parameter
    return products.map((product: Product) => ({
      id: product.id,
    }));
  } catch (error) {
    // Log the error and return an empty array to prevent build failures
    console.error('Error generating static params:', error);
    return [];
  }
}