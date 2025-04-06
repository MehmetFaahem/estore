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
    
    // After opening the cart, we need to find all buttons
    const allButtons = screen.getAllByRole('button');
    
    // Find the Plus button for the first item (should be the third button in the first item row)
    const plusButton = allButtons.find(button => 
      button.innerHTML.includes('Plus') || button.innerHTML.includes('plus')
    );
    fireEvent.click(plusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
    
    // Find the Minus button for the second item
    const minusButtons = allButtons.filter(button => 
      button.innerHTML.includes('Minus') || button.innerHTML.includes('minus')
    );
    // The second minus button should be for the second item
    if (minusButtons.length > 1) {
      fireEvent.click(minusButtons[1]);
      expect(mockUpdateQuantity).toHaveBeenCalledWith('2', 0);
    }
  });

  it('calls removeFromCart when remove button is clicked', () => {
    render(<Cart />);
    
    const cartButton = screen.getByRole('button');
    fireEvent.click(cartButton);
    
    // Find all trash buttons
    const trashButtons = screen.getAllByRole('button').filter(button => 
      button.innerHTML.includes('Trash2') || button.innerHTML.includes('trash')
    );
    // Click the first trash button
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