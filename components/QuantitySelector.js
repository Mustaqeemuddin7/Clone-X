'use client';
import './QuantitySelector.css';

export default function QuantitySelector({ quantity, onChange, max = 10 }) {
  return (
    <div className="qty-selector">
      <button className="qty-btn" onClick={() => onChange(Math.max(1, quantity - 1))} disabled={quantity <= 1}>🗑</button>
      <span className="qty-value">{quantity}</span>
      <button className="qty-btn" onClick={() => onChange(Math.min(max, quantity + 1))} disabled={quantity >= max}>+</button>
    </div>
  );
}
