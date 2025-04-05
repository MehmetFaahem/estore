'use client';

import { useStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

export function Cart() {
  const { cart, updateQuantity, removeFromCart } = useStore((state) => ({
    cart: state.cart,
    updateQuantity: state.updateQuantity,
    removeFromCart: state.removeFromCart,
  }));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg pt-24 z-[1001]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.items.length === 0
              ? 'Your cart is empty'
              : `${cart.items.length} item(s) in your cart`}
          </SheetDescription>
        </SheetHeader>
        <div className="h-[70%] mt-4 overflow-y-scroll pb-10 max-md:pb-20">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4">
              <div className="relative aspect-square h-24 w-24 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.items.length > 0 && (
          <div className="mt-4 absolute bottom-8 w-[90%] bg-white">
            <Separator className="my-4" />
            {cart.discountedTotal !== undefined && cart.discountedTotal < cart.total ? (
              <>
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="line-through text-muted-foreground">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-green-600">
                  <span>Discounted Total</span>
                  <span>${cart.discountedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>You save</span>
                  <span>${(cart.total - cart.discountedTotal).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            )}
            <Button className="w-full mt-4">Checkout</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}