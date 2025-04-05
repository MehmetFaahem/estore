'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const { addToCart, cart } = useStore((state) => ({
    addToCart: state.addToCart,
    cart: state.cart
  }));

  // Check if product is in cart
  const cartItem = cart.items.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  // Calculate discount for HuluLulu products
  const hasDiscount = product.description.includes('HuluLulu');
  const discountedPrice = hasDiscount ? product.price * 0.9 : product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-sm">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>
      
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-green-600">${discountedPrice.toFixed(2)}</p>
          <p className="text-lg line-through text-muted-foreground">${product.price.toFixed(2)}</p>
          <Badge variant="outline" className="text-green-600 border-green-600">10% OFF</Badge>
        </div>
      ) : (
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      )}
      
      <p className="text-muted-foreground">{product.description}</p>
      
      <div className="pt-4">
        <h2 className="text-lg font-semibold mb-2">Product Details</h2>
        <ul className="space-y-2">
          <li><span className="font-medium">Category:</span> {product.category}</li>
          <li><span className="font-medium">ID:</span> {product.id}</li>
          <li><span className="font-medium">Availability:</span> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
        </ul>
      </div>
      
      <Button
        size="lg"
        className="mt-6 w-full sm:w-auto transition-all duration-300 hover:scale-105"
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
        variant={isInCart ? "secondary" : "default"}
      >
        {isInCart ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart ({cartItem.quantity})
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </motion.div>
  );
}