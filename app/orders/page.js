'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import './orders.css';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {});
  }, [token]);

  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const statusColors = { pending: '#B12704', confirmed: '#007185', shipped: '#007600', out_for_delivery: '#FF9900', delivered: '#007600' };

  return (
    <div className="page-listing">
      <Navbar /><SubNav />
      <div className="orders-container">
        <h1>Your Orders</h1>
        {!user ? (
          <div className="orders-empty"><p>Please <Link href="/signin">sign in</Link> to view your orders.</p></div>
        ) : orders.length === 0 ? (
          <div className="orders-empty"><h3>No orders yet</h3><Link href="/" className="btn-amazon" style={{marginTop:12}}>Start Shopping</Link></div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div><span className="order-card-label">ORDER PLACED</span><br/>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                <div><span className="order-card-label">TOTAL</span><br/>₹{formatPrice(order.total_amount + order.delivery_fee)}</div>
                <div><span className="order-card-label">SHIP TO</span><br/>{order.shipping_name}</div>
                <div className="order-card-id">ORDER # {order.id.slice(0,8).toUpperCase()}</div>
              </div>
              <div className="order-card-body">
                <div className="order-card-status" style={{color: statusColors[order.status] || '#333'}}>
                  {order.status.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
                <div className="order-card-actions">
                  <Link href={`/order/${order.id}`} className="btn-amazon">Track package</Link>
                  <Link href={`/order/${order.id}`} className="btn-outline">View order details</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}
