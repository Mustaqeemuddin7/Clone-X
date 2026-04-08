'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import OrderTimeline from '@/components/OrderTimeline';
import Footer from '@/components/Footer';
import './order.css';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`).then(r => r.json()).then(data => {
      setOrder(data.order);
      setItems(data.items || []);
    }).catch(() => {});
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const advanceStatus = async () => {
    const statusFlow = ['pending','confirmed','shipped','out_for_delivery','delivered'];
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx < statusFlow.length - 1) {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusFlow[currentIdx + 1] })
      });
      fetchOrder();
    }
  };

  if (!order) return <div className="page-white"><Navbar /><SubNav /><div style={{textAlign:'center',padding:80}}>Loading...</div></div>;

  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const deliveryDate = order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'}) : '';

  return (
    <div className="page-listing">
      <Navbar /><SubNav />
      <div className="order-track-container">
        <div className="order-track-main">
          <h1>Order Details</h1>
          <p className="order-track-id">Order # {order.id.slice(0,8).toUpperCase()} | Placed on {new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
          
          <div className="order-track-timeline-card">
            <h3>Tracking</h3>
            <OrderTimeline currentStatus={order.status} />
            {order.status !== 'delivered' && (
              <button className="btn-amazon" onClick={advanceStatus} style={{marginTop:12}}>
                Simulate: Advance Status →
              </button>
            )}
            {deliveryDate && <p style={{marginTop:8,fontSize:13}}>Estimated delivery: <strong>{deliveryDate}</strong></p>}
          </div>

          <div className="order-track-address">
            <h3>Shipping Address</h3>
            <p>{order.shipping_name}</p>
            <p>{order.shipping_address}, {order.shipping_city}</p>
            <p>{order.shipping_state}, {order.shipping_pincode}</p>
          </div>

          <div className="order-track-items">
            <h3>Items</h3>
            {items.map(item => (
              <div key={item.id} className="order-track-item">
                <div className="order-track-item-img">{item.image_url ? <img src={item.image_url} alt="" /> : <div className="placeholder-img" style={{width:70,height:70}}>📦</div>}</div>
                <div className="order-track-item-info">
                  <Link href={`/product/${item.product_id}`} className="order-track-item-title">{item.title}</Link>
                  <div>Qty: {item.quantity}</div>
                  <div className="order-track-item-price">₹{formatPrice(item.price_at_purchase)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="order-track-sidebar">
          <h3>Order Summary</h3>
          <div className="checkout-summary-row"><span>Items:</span><span>₹{formatPrice(order.total_amount)}</span></div>
          <div className="checkout-summary-row"><span>Delivery:</span><span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span></div>
          <div className="checkout-divider" />
          <div className="checkout-summary-row checkout-summary-total"><span>Order Total:</span><span>₹{formatPrice(order.total_amount + order.delivery_fee)}</span></div>
          <div className="checkout-divider" />
          <div className="checkout-summary-row"><span>Payment:</span><span>{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span></div>
          <div className="checkout-summary-row"><span>Status:</span><span style={{color: order.payment_status === 'paid' ? 'var(--color-in-stock)' : '#CC0C39'}}>{order.payment_status}</span></div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
