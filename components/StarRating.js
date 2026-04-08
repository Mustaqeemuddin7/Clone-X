'use client';
import './StarRating.css';

export default function StarRating({ rating = 0, count = 0, size = 'md' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={`star-rating star-rating-${size}`}>
      <span className="stars" title={`${rating} out of 5 stars`}>
        {'★'.repeat(fullStars)}
        {hasHalf && <span className="star-half">★</span>}
        {'☆'.repeat(Math.max(0, emptyStars))}
      </span>
      {count > 0 && (
        <span className="star-count">
          {count >= 1000 ? `(${(count/1000).toFixed(count >= 10000 ? 0 : 1)}K)` : `(${count})`}
        </span>
      )}
    </span>
  );
}
