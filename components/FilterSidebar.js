'use client';
import './FilterSidebar.css';

export default function FilterSidebar({ categories, brands, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, onFilterChange }) {
  const ratings = [4, 3, 2, 1];
  return (
    <aside className="filter-sidebar" id="filter-sidebar">
      <div className="filter-section">
        <h4 className="filter-title">Category</h4>
        {categories.map(cat => (
          <label key={cat} className="filter-checkbox">
            <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => onFilterChange('category', cat)} />
            <span>{cat}</span>
          </label>
        ))}
        <label className="filter-checkbox">
          <input type="radio" name="category" checked={!selectedCategory} onChange={() => onFilterChange('category', '')} />
          <span>All Categories</span>
        </label>
      </div>
      <div className="filter-section">
        <h4 className="filter-title">Price</h4>
        <div className="filter-price-inputs">
          <input type="number" placeholder="₹ Min" className="filter-price-input" value={minPrice || ''} onChange={e => onFilterChange('minPrice', e.target.value)} />
          <span>-</span>
          <input type="number" placeholder="₹ Max" className="filter-price-input" value={maxPrice || ''} onChange={e => onFilterChange('maxPrice', e.target.value)} />
        </div>
      </div>
      <div className="filter-section">
        <h4 className="filter-title">Customer Reviews</h4>
        {ratings.map(r => (
          <label key={r} className="filter-checkbox">
            <input type="radio" name="rating" checked={minRating === r} onChange={() => onFilterChange('minRating', r)} />
            <span className="filter-stars">{'★'.repeat(r)}{'☆'.repeat(5-r)} & Up</span>
          </label>
        ))}
        <label className="filter-checkbox">
          <input type="radio" name="rating" checked={!minRating} onChange={() => onFilterChange('minRating', '')} />
          <span>All Ratings</span>
        </label>
      </div>
      {brands && brands.length > 0 && (
        <div className="filter-section">
          <h4 className="filter-title">Brands</h4>
          {brands.map(b => (
            <label key={b} className="filter-checkbox">
              <input type="checkbox" checked={selectedBrand === b} onChange={() => onFilterChange('brand', selectedBrand === b ? '' : b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      )}
    </aside>
  );
}
