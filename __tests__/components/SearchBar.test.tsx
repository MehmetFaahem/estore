import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SearchBar } from '@/components/SearchBar';
import { useRouter } from 'next/navigation';

// Mock the next/navigation router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />
  },
}));

// Mock fetch API
global.fetch = jest.fn();

describe('SearchBar', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones',
      price: 199.99,
      category: 'electronics',
      image: '/test-image-1.jpg',
      inStock: true,
    },
    {
      id: '2',
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch',
      price: 299.99,
      category: 'electronics',
      image: '/test-image-2.jpg',
      inStock: true,
    }
  ];

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockProducts),
    });
  });

  it('renders the search input correctly', () => {
    render(<SearchBar />);
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('updates search query when typing', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'headphones' } });
    
    expect(searchInput).toHaveValue('headphones');
  });

  it('shows clear button when search has input', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'headphones' } });
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears search input when clear button is clicked', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'headphones' } });
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  it('fetches search results when query has at least 1 character', async () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'he' } });
      // Wait for debounce timeout
      await new Promise(resolve => setTimeout(resolve, 400));
    });
    
    expect(global.fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/search?query=he`);
  });

  it('navigates to product page when search form is submitted', async () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'headphones' } });
      // Wait for debounce timeout
      await new Promise(resolve => setTimeout(resolve, 400));
    });
    
    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalled();
    
    // Submit the form
    await act(async () => {
      const form = searchInput.closest('form');
      fireEvent.submit(form!);
    });
    
    expect(mockPush).toHaveBeenCalledWith('/product/1');
  });

  it('does not fetch results when query is empty', async () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } });
      // Wait for debounce timeout
      await new Promise(resolve => setTimeout(resolve, 400));
    });
    
    expect(global.fetch).not.toHaveBeenCalled();
  });
});