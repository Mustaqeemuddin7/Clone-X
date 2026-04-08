'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import './home.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch('/api/products?limit=20&sort=bestselling')
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {});
    fetch('/api/products?limit=8&sort=discount')
      .then(r => r.json())
      .then(data => setDeals(data.products || []))
      .catch(() => {});
  }, []);

  const categoryCards = [
    {
      title: 'Appliances for your home | Up to 55% off',
      items: [
        { label: 'Air conditioners', image: '/images/products/p1.jpg', href: '/search?category=Electronics&q=air+conditioner' },
        { label: 'Refrigerators', image: 'https://m.media-amazon.com/images/I/61L1ItFgFHL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen&q=refrigerator' },
        { label: 'Microwaves', image: 'https://m.media-amazon.com/images/I/71V1IopMz+L._SX679_.jpg', href: '/search?category=Home+%26+Kitchen&q=microwave' },
        { label: 'Washing machines', image: 'https://m.media-amazon.com/images/I/71T2VzdoHDL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen&q=washing' },
      ],
      linkText: 'See more', linkHref: '/search?category=Home+%26+Kitchen'
    },
    {
      title: 'Revamp your home in style',
      items: [
        { label: 'Cushion covers, bedsheets & more', image: '/images/products/p11.jpg', href: '/search?category=Home+%26+Kitchen&q=bedsheet' },
        { label: 'Figurines, vases & more', image: '/images/products/p12.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Home storage', image: 'https://m.media-amazon.com/images/I/71FdkdFo8vL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Lighting solutions', image: 'https://m.media-amazon.com/images/I/61YIWQ-1YjL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen' },
      ],
      linkText: 'Explore all', linkHref: '/search?category=Home+%26+Kitchen'
    },
    {
      title: 'Bulk order discounts + Up to 18% GST savings',
      items: [
        { label: 'Up to 45% off | Laptops', image: '/images/products/p7.jpg', href: '/search?category=Electronics&q=laptop' },
        { label: 'Up to 60% off | Kitchen appliances', image: '/images/products/p9.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Min. 50% off | Office furniture', image: 'https://m.media-amazon.com/images/I/61YIWQ-1YjL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen&q=chair' },
        { label: 'Register using GST', image: 'https://m.media-amazon.com/images/G/31/img22/Fashion/Gateway/BAU/BTF-702702702/Unrec/PC-702x702._CB612137738_.jpg', href: '#' },
      ],
      linkText: 'Create a free account', linkHref: '/signin'
    },
    {
      title: 'Starting ₹149 | Top picks from trending styles',
      items: [
        { label: "Men's Clothing", image: '/images/products/p13.jpg', href: '/search?category=Fashion' },
        { label: "Women's Clothing", image: 'https://m.media-amazon.com/images/I/51JbsHSktkL._SY741_.jpg', href: '/search?category=Fashion' },
        { label: 'Shoes & Footwear', image: '/images/products/p15.jpg', href: '/search?category=Fashion&q=shoes' },
        { label: 'Accessories', image: 'https://m.media-amazon.com/images/I/61LPbSEU3cL._SX679_.jpg', href: '/search?category=Electronics&q=watch' },
      ],
      linkText: 'See more', linkHref: '/search?category=Fashion'
    },
  ];

  const categoryCards2 = [
    {
      title: 'Up to 60% off | Automotive essentials',
      items: [
        { label: 'Cleaning accessories', image: 'https://m.media-amazon.com/images/I/71E6yv1HPOL._SX679_.jpg', href: '/search' },
        { label: 'Tyre & rim care', image: 'https://m.media-amazon.com/images/I/81gMVOBBIKL._SX679_.jpg', href: '/search' },
        { label: 'Helmets', image: 'https://m.media-amazon.com/images/I/51JijmpCLOL._SX679_.jpg', href: '/search' },
        { label: 'Vaccum cleaner', image: '/images/products/p10.jpg', href: '/search' },
      ],
      linkText: 'See more', linkHref: '/search'
    },
    {
      title: 'Starting ₹49 | Home essentials',
      items: [
        { label: 'Cleaning supplies', image: '/images/products/p9.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Bathroom accessories', image: '/images/products/p12.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Home tools', image: 'https://m.media-amazon.com/images/I/71FdkdFo8vL._SX679_.jpg', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Wallpapers', image: '/images/products/p11.jpg', href: '/search?category=Home+%26+Kitchen' },
      ],
      linkText: 'Explore all', linkHref: '/search?category=Home+%26+Kitchen'
    },
    {
      title: 'Toys, Books & more',
      items: [
        { label: 'Building toys', image: 'https://m.media-amazon.com/images/I/91fMFyeeJyL._SX679_.jpg', href: '/search?category=Toys' },
        { label: 'Bestselling books', image: 'https://m.media-amazon.com/images/I/81F90H7hnML._SY466_.jpg', href: '/search?category=Books' },
        { label: 'Sports & fitness', image: 'https://m.media-amazon.com/images/I/81gMVOBBIKL._SX679_.jpg', href: '/search?category=Sports' },
        { label: 'Beauty & grooming', image: 'https://m.media-amazon.com/images/I/51EgU2MKS-L._SY879_.jpg', href: '/search?category=Beauty' },
      ],
      linkText: 'See all', linkHref: '/search'
    },
    {
      title: 'Headphones & Speakers',
      items: [
        { label: 'Wireless headphones', image: 'https://m.media-amazon.com/images/I/61Kp8pFMGhL._SX679_.jpg', href: '/search?q=headphones' },
        { label: 'Smartwatches', image: 'https://m.media-amazon.com/images/I/61LPbSEU3cL._SX679_.jpg', href: '/search?q=watch' },
        { label: 'Soundbars', image: 'https://m.media-amazon.com/images/I/31Uai3CNOOL._SX679_.jpg', href: '/search?q=soundbar' },
        { label: 'Earbuds', image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX679_.jpg', href: '/search?q=earbuds' },
      ],
      linkText: 'See all', linkHref: '/search?category=Electronics'
    },
  ];

  return (
    <div className="page-home">
      <Navbar />
      <SubNav />
      <main>
        <HeroCarousel />
        <div className="category-cards-row">
          {categoryCards.map((card, i) => (
            <CategoryCard key={i} {...card} />
          ))}
        </div>

        {/* Deals Row */}
        {deals.length > 0 && (
          <section className="deals-section">
            <h2 className="section-title">Today's Deals</h2>
            <div className="deals-scroll">
              {deals.map(p => (
                <div key={p.id} className="deal-card-wrapper">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="category-cards-row" style={{marginTop: '16px'}}>
          {categoryCards2.map((card, i) => (
            <CategoryCard key={i} {...card} />
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 && (
          <section className="deals-section">
            <h2 className="section-title">Best Sellers in Electronics</h2>
            <div className="deals-scroll">
              {products.filter(p => p.category === 'Electronics').slice(0, 8).map(p => (
                <div key={p.id} className="deal-card-wrapper">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
