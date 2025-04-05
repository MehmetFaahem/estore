import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cart } from '@/components/Cart';
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

describe('Cart', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      category: 'electronics',
      image: '/test-image-1.jpg',
      inStock: true,
      quantity: 2
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'HuluLulu Test Description 2',
      price: 50.00,
      category: 'accessories',
      image: '/test-image-2.jpg',
      inStock: true,
      quantity: 1
    }
  ];

  const mockUpdateQuantity = jest.fn();
  const mockRemoveFromCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockImplementation((selector) => 
      selector({
        cart: { 
          items: mockCartItems,
          total: 249.98,
          discountedTotal: 244.98 // 10% discount on the HuluLulu product
        },
        updateQuantity: mockUpdateQuantity,
        removeFromCart: mockRemoveFromCart,
      })
    );
  });

  it('renders cart with correct number of items', () => {
    render(<Cart />);
    
    // The cart button should show the total quantity (3)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('opens cart sheet when cart button is clicked', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('2 item(s) in your cart')).toBeInTheDocument();
  });

  it('displays correct product information in cart', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('calls updateQuantity when quantity buttons are clicked', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    // Find all plus buttons
    const plusButtons = screen.getAllByRole('button', { name: /\+/i });
    fireEvent.click(plusButtons[0]);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
    
    // Find all minus buttons
    const minusButtons = screen.getAllByRole('button', { name: /\-/i });
    fireEvent.click(minusButtons[1]);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('2', 0);
  });

  it('calls removeFromCart when remove button is clicked', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    // Find all trash buttons
    const trashButtons = screen.getAllByRole('button', { name: '' });
    // Click the first trash button that has a Trash2 icon
    fireEvent.click(trashButtons[0]);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('displays discounted total when applicable', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    expect(screen.getByText('$249.98')).toBeInTheDocument(); // Original total
    expect(screen.getByText('$244.98')).toBeInTheDocument(); // Discounted total
    expect(screen.getByText('$5.00')).toBeInTheDocument(); // Savings
  });
});