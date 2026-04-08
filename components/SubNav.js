'use client';
import { useState } from 'react';
import Link from 'next/link';
import './SubNav.css';

export default function SubNav() {
  const [showSideMenu, setShowSideMenu] = useState(false);

  const navLinks = [
    { label: 'Fresh', href: '/search?category=Grocery' },
    { label: 'MX Player', href: '#' },
    { label: 'Sell', href: '#' },
    { label: 'Bestsellers', href: '/search?sort=bestselling' },
    { label: 'Mobiles', href: '/search?category=Electronics&subcategory=Mobiles' },
    { label: 'Customer Service', href: '#' },
    { label: "Today's Deals", href: '/search?sort=discount' },
    { label: 'New Releases', href: '/search?sort=newest' },
    { label: 'Prime', href: '#' },
    { label: 'Fashion', href: '/search?category=Fashion' },
    { label: 'Electronics', href: '/search?category=Electronics' },
    { label: 'Amazon Pay', href: '#' },
  ];

  const menuCategories = [
    {
      title: 'Trending',
      items: [
        { label: 'Bestsellers', href: '/search?sort=bestselling' },
        { label: 'New Releases', href: '/search?sort=newest' },
        { label: 'Movers and Shakers', href: '/search?sort=bestselling' },
      ]
    },
    {
      title: 'Digital Content and Devices',
      items: [
        { label: 'Echo & Alexa', href: '#' },
        { label: 'Fire TV', href: '#' },
        { label: 'Kindle E-Readers & eBooks', href: '/search?category=Books' },
      ]
    },
    {
      title: 'Shop by Category',
      items: [
        { label: 'Mobiles, Computers', href: '/search?category=Electronics' },
        { label: 'TV, Appliances, Electronics', href: '/search?category=Electronics' },
        { label: "Men's Fashion", href: '/search?category=Fashion' },
        { label: "Women's Fashion", href: '/search?category=Fashion' },
        { label: 'Home & Kitchen', href: '/search?category=Home+%26+Kitchen' },
        { label: 'Beauty & Personal Care', href: '/search?category=Beauty' },
        { label: 'Books', href: '/search?category=Books' },
        { label: 'Sports & Fitness', href: '/search?category=Sports' },
        { label: 'Toys & Games', href: '/search?category=Toys' },
        { label: 'Grocery', href: '/search?category=Grocery' },
      ]
    }
  ];

  return (
    <>
      <nav className="subnav" id="sub-nav">
        <div className="subnav-inner">
          <button className="subnav-all" onClick={() => setShowSideMenu(true)} id="subnav-all-btn">
            <span className="hamburger">☰</span> All
          </button>
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className="subnav-link">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Side Menu Overlay */}
      {showSideMenu && (
        <div className="sidemenu-overlay" onClick={() => setShowSideMenu(false)}>
          <div className="sidemenu" onClick={(e) => e.stopPropagation()}>
            <div className="sidemenu-header">
              <span className="sidemenu-avatar">👤</span>
              <span className="sidemenu-greeting">Hello, sign in</span>
              <button className="sidemenu-close" onClick={() => setShowSideMenu(false)}>✕</button>
            </div>
            <div className="sidemenu-content">
              {menuCategories.map((section, i) => (
                <div key={i} className="sidemenu-section">
                  <h3 className="sidemenu-section-title">{section.title}</h3>
                  {section.items.map((item, j) => (
                    <Link key={j} href={item.href} className="sidemenu-item" onClick={() => setShowSideMenu(false)}>
                      {item.label}
                      <span className="sidemenu-arrow">›</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
