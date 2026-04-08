'use client';
import { useState, useEffect, useCallback } from 'react';
import './HeroCarousel.css';

const slides = [
  {
    id: 1,
    title: 'Starting ₹99',
    subtitle: 'Budget store',
    tagline: 'Top Brands | Wide Selection',
    bg: 'linear-gradient(135deg, #E3ECF5 0%, #C9D6E5 100%)',
    accent: '#232F3E',
    images: ['/images/products/p4.jpg', '/images/products/p7.jpg', '/images/products/p6.jpg'],
  },
  {
    id: 2,
    title: 'Up to 50% off',
    subtitle: 'Electronics Sale',
    tagline: 'Mobiles, Laptops, TVs & more',
    bg: 'linear-gradient(135deg, #FFF8E7 0%, #FFE8B0 100%)',
    accent: '#B12704',
    images: ['/images/products/p5.jpg', '/images/products/p8.jpg', '/images/products/p1.jpg'],
  },
  {
    id: 3,
    title: 'Fashion Deals',
    subtitle: 'Min 40% Off',
    tagline: 'Clothing, Shoes & Accessories',
    bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    accent: '#1B5E20',
    images: ['/images/products/p13.jpg', '/images/products/p15.jpg', '/images/products/p14.jpg'],
  },
  {
    id: 4,
    title: 'Home Makeover',
    subtitle: 'Up to 60% Off',
    tagline: 'Furniture, Decor & Kitchen',
    bg: 'linear-gradient(135deg, #FDE7F0 0%, #F8BBD0 100%)',
    accent: '#880E4F',
    images: ['/images/products/p9.jpg', '/images/products/p10.jpg', '/images/products/p11.jpg'],
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  return (
    <div className="hero-carousel" id="hero-carousel">
      <div className="hero-slide" style={{ background: slide.bg }}>
        <div className="hero-content">
          <h2 className="hero-title" style={{ color: slide.accent }}>{slide.title}</h2>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <p className="hero-tagline">{slide.tagline}</p>
          <div className="hero-cashback">
            <span className="hero-cashback-badge">amazon pay</span>
            <span>Unlimited 5% cashback</span>
          </div>
        </div>
        <div className="hero-image-area">
          <div className="hero-product-showcase">
            {slide.images.map((img, i) => (
              <div key={i} className={`hero-showcase-item hero-showcase-item-${i}`}>
                <img src={img} alt="" loading="eager" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
        ‹
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
        ›
      </button>
      <div className="hero-gradient-bottom"></div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'hero-dot-active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
