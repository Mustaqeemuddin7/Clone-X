'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Calculate totals from items
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  // Load cart from localStorage on mount, and from API if logged in
  useEffect(() => {
    const savedCart = localStorage.getItem('cart_items');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync with API when token changes
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setCartItems(data.items);
        }
      }
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: 'local_' + Date.now(),
        product_id: product.id,
        title: product.title,
        price: product.price,
        mrp: product.mrp,
        discount_percent: product.discount_percent,
        image_url: product.image_url,
        brand: product.brand,
        is_fulfilled: product.is_fulfilled,
        stock: product.stock,
        quantity,
      }];
    });

    // Sync with API
    if (token) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id, quantity }),
        });
      } catch (e) {
        console.error('Failed to sync cart:', e);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
    if (token) {
      const item = cartItems.find(i => i.product_id === productId);
      if (item) {
        try {
          await fetch(`/api/cart/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity }),
          });
        } catch (e) {
          console.error('Failed to update cart:', e);
        }
      }
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find(i => i.product_id === productId);
    setCartItems(prev => prev.filter(i => i.product_id !== productId));
    if (token && item) {
      try {
        await fetch(`/api/cart/${item.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error('Failed to remove from cart:', e);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart_items');
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product_id === productId);
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, loading,
      addToCart, updateQuantity, removeFromCart, clearCart, getCartItem, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
