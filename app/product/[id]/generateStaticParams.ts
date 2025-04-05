// This file handles static site generation parameters

import { products } from "@/app/api/products/route";
import { Product } from "@/lib/types";

export async function generateStaticParams() {
    try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
    //   if (!res.ok) return [];
  
    //   const products = await res.json();
      return products.map((product: Product) => ({ id: product.id }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }
  