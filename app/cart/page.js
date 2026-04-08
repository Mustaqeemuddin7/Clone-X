'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import QuantitySelector from '@/components/QuantitySelector';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import './cart.css';

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const deliveryFee = cartTotal >= 499 ? 0 : 40;

  return (
    <div className="page-white">
      <Navbar /><SubNav />
      <div className="cart-container">
        <div className="cart-main">
          <h1 className="cart-title">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <h2>Your Amazon Cart is empty</h2>
              <p>Shop today's deals</p>
              <Link href="/" className="btn-amazon">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-header-row">
                <span className="cart-deselect">Deselect all items</span>
                <span className="cart-price-header">Price</span>
              </div>
              <div className="cart-divider" />
              {cartItems.map(item => (
                <div key={item.product_id} className="cart-item" id={`cart-item-${item.product_id}`}>
                  <input type="checkbox" className="cart-item-check" defaultChecked />
                  <Link href={`/product/${item.product_id}`} className="cart-item-image">
                    {item.image_url ? <img src={item.image_url} alt="" /> : <div className="placeholder-img" style={{width:120,height:120}}>📦</div>}
                  </Link>
                  <div className="cart-item-details">
                    <Link href={`/product/${item.product_id}`} className="cart-item-title">{item.title}</Link>
                    <div className="cart-item-stock" style={{color:'var(--color-in-stock)'}}>In stock</div>
                    {item.is_fulfilled ? <span className="badge-fulfilled">Fulfilled</span> : null}
                    <div className="cart-item-delivery">
                      FREE delivery by <strong>{new Date(Date.now()+5*24*60*60*1000).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</strong>
                    </div>
                    <div className="cart-item-actions">
                      <QuantitySelector quantity={item.quantity} onChange={(q) => updateQuantity(item.product_id, q)} />
                      <button className="btn-link" onClick={() => removeFromCart(item.product_id)}>Delete</button>
                      <span className="cart-item-sep">|</span>
                      <button className="btn-link">Save for later</button>
                      <span className="cart-item-sep">|</span>
                      <button className="btn-link">Share</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <span className="cart-item-price-value">₹{formatPrice(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="cart-item-mrp">M.R.P.: <s>₹{formatPrice(item.mrp)}</s></span>
                    )}
                    {item.discount_percent > 0 && (
                      <span className="cart-item-discount">({item.discount_percent}% off)</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="cart-divider" />
              <div className="cart-subtotal-bottom">
                Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}): <strong>₹{formatPrice(cartTotal)}</strong>
              </div>
            </>
          )}
        </div>
        {cartItems.length > 0 && (
          <aside className="cart-sidebar">
            <div className="cart-sidebar-box">
              <div className="cart-sidebar-subtotal">
                Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''}): <strong>₹{formatPrice(cartTotal + deliveryFee)}</strong>
              </div>
              <Link href="/checkout" className="btn-amazon btn-amazon-lg" style={{marginTop:12}}>
                Proceed to Buy ({cartCount} item{cartCount !== 1 ? 's' : ''})
              </Link>
            </div>
          </aside>
        )}
      </div>
      <Footer />
    </div>
  );
}
