'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Cart } from '@/components/Cart';
import { SearchBar } from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = useStore((state) => state.filters);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      if (filters.inStock === true && !product.inStock) {
        return false;
      }
      // Filter by search query if it exists
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b fixed w-full bg-white z-[1000]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Store</h1>
          <div className="flex items-center gap-4">
            <SearchBar />
            <Cart />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-28 z-[500]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <ProductFilters />
          </aside>
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="mb-4 text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}