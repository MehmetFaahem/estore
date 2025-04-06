import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';

// Mock the zustand store
jest.mock('@/lib/store', () => ({
  useStore: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />
  },
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'electronics',
    image: '/test-image.jpg',
    inStock: true,
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockImplementation((selector) => 
      selector({
        cart: { items: [] },
        addToCart: mockAddToCart,
      })
    );
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description...')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls addToCart when Add to Cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('disables Add to Cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    render(<ProductCard product={outOfStockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
    
    fireEvent.click(addButton);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it('shows discounted price for HuluLulu products', () => {
    const discountProduct = { 
      ...mockProduct, 
      description: 'HuluLulu premium product',
      price: 100
    };
    
    render(<ProductCard product={discountProduct} />);
    
    expect(screen.getByText('$90.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
  });

  it('shows different UI when product is already in cart', () => {
    (useStore as jest.Mock).mockImplementation((selector) => 
      selector({
        cart: { 
          items: [{
            ...mockProduct,
            quantity: 2
          }] 
        },
        addToCart: mockAddToCart,
      })
    );

    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/carted/i)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });
});