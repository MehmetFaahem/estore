import { Suspense } from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductClient from './ProductClient';

// Import generateStaticParams from dedicated file
export { generateStaticParams } from './generateStaticParams';


// This is a server component that fetches data
async function getProduct(id: string) {
  // Fetch product data from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
  const data = await res.json();
  
  if (Array.isArray(data)) {
    const product = data.find(p => p.id === id);
    
    // Find related products
    const relatedProducts = product 
      ? data.filter(p => p.category === product.category && p.id !== id).slice(0, 3)
      : [];
      
    return { product, relatedProducts };
  }
  
  return { product: null, relatedProducts: [] };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Get the product data using the server component function
  const { product, relatedProducts } = await getProduct(params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-28 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link href="/" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover max-md:w-full max-h-[600px]"
            priority
          />
        </div>
        
        {/* Client component for interactive elements */}
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <ProductClient product={product} />
        </Suspense>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link href={`/product/${relatedProduct.id}`} key={relatedProduct.id}>
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-video">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{relatedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">${relatedProduct.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}