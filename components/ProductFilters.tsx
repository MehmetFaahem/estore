'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const categories = ['All', 'electronics', 'accessories', 'footwear'];

export function ProductFilters() {
  const { filters, setFilters } = useStore((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
  }));

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) => {
            // Ensure min doesn't exceed max and max isn't less than min
            const validMin = Math.min(min, max);
            const validMax = Math.max(min, max);
            setFilters({ minPrice: validMin, maxPrice: validMax });
          }}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={filters.inStock === true}
          onCheckedChange={(checked) => setFilters({ inStock: checked ? true : null })}
        />
        <Label>Show only in stock items</Label>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value: any) => setFilters({ sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          setFilters({
            category: '',
            minPrice: 0,
            maxPrice: 1000,
            inStock: null,
            sortBy: 'name-asc',
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );
}