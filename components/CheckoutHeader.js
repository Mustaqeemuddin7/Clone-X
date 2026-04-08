'use client';
import Link from 'next/link';
import './CheckoutHeader.css';

export default function CheckoutHeader() {
  return (
    <header className="checkout-header">
      <div className="checkout-header-inner">
        <Link href="/" className="checkout-logo">amazon<span>.in</span></Link>
        <h1 className="checkout-title">Secure checkout ▾</h1>
        <Link href="/cart" className="checkout-cart">🛒 Cart</Link>
      </div>
    </header>
  );
}
