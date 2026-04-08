'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Footer from '@/components/Footer';
import './search.css';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: searchParams.get('sort') || 'bestselling',
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setCategories(data.categories || []);
        setBrands(data.brands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-listing">
      <Navbar />
      <SubNav />
      <div className="search-page-content">
        <FilterSidebar
          categories={categories}
          brands={brands}
          selectedCategory={filters.category}
          selectedBrand={filters.brand}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          minRating={filters.minRating}
          onFilterChange={handleFilterChange}
        />
        <main className="search-main">
          <div className="search-header">
            <span className="search-results-count">
              {loading ? 'Searching...' : `${total} results`}
              {filters.q && ` for "${filters.q}"`}
            </span>
            <div className="search-sort">
              <label>Sort by: </label>
              <select value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)}>
                <option value="bestselling">Bestselling</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>
          <h2 className="search-results-title">Results</h2>
          {loading ? (
            <div className="search-loading">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{height:300,borderRadius:4}} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="search-empty">
              <h3>No results found</h3>
              <p>Try different keywords or browse categories</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
