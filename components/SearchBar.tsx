'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setFilters = useStore((state) => state.setFilters);

  // Handle search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        setIsSearching(true);
        fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setShowResults(true);
            setIsSearching(false);
            
            // Update the global filter state with the search query
            // This will filter products on the main page
            setFilters({ searchQuery: searchQuery.trim() });
          })
          .catch(error => {
            console.error('Error searching products:', error);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
        setShowResults(false);
        // Clear the search filter when search query is empty
        setFilters({ searchQuery: '' });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setFilters]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      // Navigate to a search results page (could be implemented in the future)
      // For now, just focus on the first result if available
      if (searchResults.length > 0) {
        router.push(`/product/${searchResults[0].id}`);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
          onFocus={() => searchQuery.trim().length >= 1 && setShowResults(true)}
        />
        {searchQuery ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchQuery('');
              // Clear the search filter when clearing the search input
              setFilters({ searchQuery: '' });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
      </form>

      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-[1002] mt-1 max-h-[70vh] overflow-auto rounded-md border bg-background shadow-md"
          >
            <Card className="p-2">
              <div className="text-xs text-muted-foreground p-2">
                {searchResults.length} results found
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}