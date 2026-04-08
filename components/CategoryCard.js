'use client';
import Link from 'next/link';
import './CategoryCard.css';

export default function CategoryCard({ title, items, linkText = 'See more', linkHref = '#' }) {
  return (
    <div className="category-card">
      <h3 className="category-card-title">{title}</h3>
      <div className="category-card-grid">
        {items.map((item, i) => (
          <Link key={i} href={item.href || '#'} className="category-card-item">
            <div className="category-card-img">
              {item.image ? (
                <img src={item.image} alt={item.label} loading="lazy" />
              ) : (
                <div className="placeholder-img" style={{ height: '100%', width: '100%' }}>
                  {item.icon || '📦'}
                </div>
              )}
            </div>
            <span className="category-card-label">{item.label}</span>
          </Link>
        ))}
      </div>
      <Link href={linkHref} className="category-card-link">{linkText}</Link>
    </div>
  );
}
