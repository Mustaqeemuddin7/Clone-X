'use client';
import Link from 'next/link';
import StarRating from './StarRating';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-IN');
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      <Link href={`/product/${product.id}`} className="product-card-image-link">
        <div className="product-card-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} loading="lazy" />
          ) : (
            <div className="placeholder-img" style={{ height: '220px', width: '100%' }}>
              📦 {product.brand}
            </div>
          )}
        </div>
      </Link>
      <div className="product-card-info">
        <Link href={`/product/${product.id}`} className="product-card-title">
          {product.title}
        </Link>
        <div className="product-card-rating">
          <span className="rating-value">{product.rating}</span>
          <StarRating rating={product.rating} count={product.review_count} size="sm" />
        </div>
        {product.bought_past_month > 100 && (
          <div className="product-card-bought">
            {product.bought_past_month >= 1000 
              ? `${(product.bought_past_month/1000).toFixed(0)}K+ bought in past month`
              : `${product.bought_past_month}+ bought in past month`
            }
          </div>
        )}
        <div className="product-card-price">
          {product.discount_percent > 0 && (
            <span className="product-card-discount">-{product.discount_percent}%</span>
          )}
          <span className="product-card-price-symbol">₹</span>
          <span className="product-card-price-whole">{formatPrice(product.price)}</span>
        </div>
        {product.mrp > product.price && (
          <div className="product-card-mrp">
            M.R.P.: <span className="product-card-mrp-value">₹{formatPrice(product.mrp)}</span>
          </div>
        )}
        {product.is_fulfilled ? (
          <div className="product-card-fulfilled">
            <span className="badge-fulfilled">Fulfilled</span>
          </div>
        ) : null}
        <div className="product-card-delivery">
          FREE delivery by <strong>
            {new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short'})}
          </strong>
        </div>
      </div>
    </div>
  );
}
