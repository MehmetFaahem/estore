import { act, renderHook } from '@testing-library/react';
import { useStore } from '@/lib/store';

describe('Store', () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.clearCart();
      result.current.setFilters({
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        inStock: null,
        sortBy: 'name-asc',
      });
    });
  });

  describe('Cart operations', () => {
    const testProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'electronics',
      image: '/test-image.jpg',
      inStock: true,
    };

    const huluLuluProduct = {
      id: '2',
      name: 'HuluLulu Product',
      description: 'HuluLulu Test Description',
      price: 100,
      category: 'electronics',
      image: '/test-image-2.jpg',
      inStock: true,
    };

    it('should add a product to the cart', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe('1');
      expect(result.current.cart.items[0].quantity).toBe(1);
      expect(result.current.cart.total).toBe(100);
    });

    it('should increase quantity when adding the same product', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
        result.current.addToCart(testProduct);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.cart.total).toBe(200);
    });

    it('should apply discount for HuluLulu products', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(huluLuluProduct);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.total).toBe(100);
      expect(result.current.cart.discountedTotal).toBe(90); // 10% discount
    });

    it('should remove a product from the cart', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
        result.current.addToCart(huluLuluProduct);
        result.current.removeFromCart('1');
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe('2');
    });

    it('should update product quantity', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
        result.current.updateQuantity('1', 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.total).toBe(500);
    });

    it('should not update quantity to less than 1', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
        result.current.updateQuantity('1', 0);
      });

      // Quantity should remain 1
      expect(result.current.cart.items[0].quantity).toBe(1);
    });

    it('should clear the cart', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.addToCart(testProduct);
        result.current.addToCart(huluLuluProduct);
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.total).toBe(0);
    });
  });

  describe('Filter operations', () => {
    it('should update filters', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.setFilters({ category: 'electronics' });
      });

      expect(result.current.filters.category).toBe('electronics');
      
      // Other filters should remain unchanged
      expect(result.current.filters.minPrice).toBe(0);
      expect(result.current.filters.maxPrice).toBe(1000);
    });

    it('should update multiple filters at once', () => {
      const { result } = renderHook(() => useStore());
      
      act(() => {
        result.current.setFilters({
          category: 'footwear',
          minPrice: 50,
          maxPrice: 200,
          inStock: true,
        });
      });

      expect(result.current.filters.category).toBe('footwear');
      expect(result.current.filters.minPrice).toBe(50);
      expect(result.current.filters.maxPrice).toBe(200);
      expect(result.current.filters.inStock).toBe(true);
    });
  });
});