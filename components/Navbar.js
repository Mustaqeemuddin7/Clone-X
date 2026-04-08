'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);

  const categories = ['All', 'Electronics', 'Home & Kitchen', 'Fashion', 'Books', 'Beauty', 'Sports', 'Toys', 'Grocery'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" id="nav-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-suffix">.in</span>
        </Link>

        {/* Delivery location */}
        <div className="navbar-location" id="nav-location">
          <span className="location-icon">📍</span>
          <div className="location-text">
            <span className="location-label">Delivering to Hyderabad 500048</span>
            <span className="location-update">Update location</span>
          </div>
        </div>

        {/* Search bar */}
        <form className="navbar-search" onSubmit={handleSearch} id="nav-search">
          <select
            className="search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            id="search-category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
          <button type="submit" className="search-btn" id="search-submit-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Language */}
        <div className="navbar-lang" id="nav-lang">
          <span className="lang-flag">🇮🇳</span>
          <span className="lang-text">EN</span>
        </div>

        {/* Account */}
        <div className="navbar-account" ref={accountRef} id="nav-account">
          <div
            className="account-trigger"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <span className="account-label">
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <span className="account-title">Account & Lists ▾</span>
          </div>
          {showAccountMenu && (
            <div
              className="account-dropdown"
              onMouseEnter={() => setShowAccountMenu(true)}
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              {!user ? (
                <div className="dropdown-signin">
                  <Link href="/signin" className="btn-amazon btn-amazon-lg">Sign in</Link>
                  <p className="dropdown-new">New customer? <Link href="/signin?mode=register">Start here.</Link></p>
                </div>
              ) : (
                <div className="dropdown-signed-in">
                  <div className="dropdown-section">
                    <h4>Your Account</h4>
                    <Link href="/orders">Your Orders</Link>
                    <Link href="/cart">Your Cart</Link>
                    <button onClick={logout} className="btn-link">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Orders */}
        <Link href="/orders" className="navbar-orders" id="nav-orders">
          <span className="orders-label">Returns</span>
          <span className="orders-title">& Orders</span>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="navbar-cart" id="nav-cart">
          <div className="cart-icon-wrapper">
            <span className="cart-count">{cartCount}</span>
            <svg viewBox="0 0 40 35" width="38" height="33" className="cart-svg">
              <path d="M3 3h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L26 8H8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
              <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
              <circle cx="21" cy="22" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <span className="cart-text">Cart</span>
        </Link>
      </div>
    </header>
  );
}
