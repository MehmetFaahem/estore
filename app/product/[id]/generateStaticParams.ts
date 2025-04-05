// This file handles static site generation parameters

import { Product } from "@/lib/types";

export async function generateStaticParams() {
  // Fetch all products to get their IDs
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
  const products = await res.json();
  
  // Return an array of objects with the id parameter
  return products.map((product: Product) => ({
    id: product.id,
  }));
}