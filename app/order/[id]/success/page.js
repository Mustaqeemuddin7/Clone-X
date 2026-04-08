'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import Footer from '@/components/Footer';
import './success.css';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`/api/orders/${id}`).then(r => r.json()).then(data => {
      setOrder(data.order);
      setItems(data.items || []);
    }).catch(() => {});
  }, [id]);

  if (!order) return <div className="page-white"><Navbar /><SubNav /><div style={{textAlign:'center',padding:80}}>Loading...</div></div>;

  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const deliveryDate = order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}) : 'Within 5 days';

  return (
    <div className="page-white">
      <Navbar /><SubNav />
      <div className="success-container">
        <div className="success-main">
          <div className="success-header">
            <span className="success-check">✅</span>
            <h1 className="success-title">Order placed, thank you!</h1>
          </div>
          <p>Confirmation will be sent to your email.</p>
          <div className="success-shipping">
            <strong>Shipping to {order.shipping_name}</strong>, {order.shipping_address}, {order.shipping_city}, {order.shipping_state}, {order.shipping_pincode}, India
          </div>
          <div className="success-delivery">
            <strong>{deliveryDate}</strong><br />Delivery date
          </div>
          {items.map(item => (
            <div key={item.id} className="success-item">
              <div className="success-item-img">{item.image_url ? <img src={item.image_url} alt="" /> : <div className="placeholder-img" style={{width:60,height:60}}>📦</div>}</div>
              <div>
                <div className="success-item-title">{item.title}</div>
                <div>Qty: {item.quantity} × ₹{formatPrice(item.price_at_purchase)}</div>
              </div>
            </div>
          ))}
          <div className="success-actions">
            <Link href={`/order/${id}`} className="btn-amazon">Track your order</Link>
            <Link href="/" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
