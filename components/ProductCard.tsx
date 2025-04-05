'use client';

import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/product/${product.id}`} className="block cursor-pointer transition-transform hover:scale-[1.02]">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant={product.inStock ? 'default' : 'destructive'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{product.description.slice(0,50) + '...'}</p>
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-green-600">${discountedPrice.toFixed(2)}</p>
              <p className="text-sm line-through text-muted-foreground">${product.price.toFixed(2)}</p>
              <Badge variant="outline" className="text-green-600 border-green-600">10% OFF</Badge>
            </div>
          ) : (
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking the button
              addToCart(product);
            }}
            disabled={!product.inStock}
            variant={isInCart ? "secondary" : "default"}
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Carted ( {cartItem.quantity} ) Click to add more
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}