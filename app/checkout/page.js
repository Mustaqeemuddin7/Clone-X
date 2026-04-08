'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CheckoutHeader from '@/components/CheckoutHeader';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './checkout.css';

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', line: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setAddress({ name: user.name || '', line: user.address_line || '', city: user.city || '', state: user.state || '', pincode: user.pincode || '' });
    }
  }, [user]);

  const deliveryFee = cartTotal >= 499 ? 0 : 40;
  const orderTotal = cartTotal + deliveryFee;
  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const deliveryDate = new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  if (!user) {
    return (
      <div className="page-checkout">
        <CheckoutHeader />
        <div className="checkout-container">
          <div className="checkout-main">
            <div className="checkout-section">
              <h2>Please sign in to continue</h2>
              <p style={{margin:'12px 0'}}>You need to be signed in to complete checkout.</p>
              <Link href="/signin" className="btn-amazon btn-amazon-lg" style={{maxWidth:300}}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-checkout">
        <CheckoutHeader />
        <div className="checkout-container">
          <div className="checkout-main">
            <div className="checkout-section"><h2>Your cart is empty</h2><Link href="/" className="btn-amazon" style={{marginTop:12}}>Continue Shopping</Link></div>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError('');
    setProcessing(true);
    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          shipping_name: address.name, shipping_address: address.line, shipping_city: address.city,
          shipping_state: address.state, shipping_pincode: address.pincode, payment_method: paymentMethod,
          items: cartItems.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      // Process payment
      const payRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: orderData.order_id, method: paymentMethod, amount: orderTotal })
      });
      const payData = await payRes.json();
      
      if (payData.success) {
        clearCart();
        router.push(`/order/${orderData.order_id}/success`);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    }
    setProcessing(false);
  };

  return (
    <div className="page-checkout">
      <CheckoutHeader />
      <div className="checkout-container">
        <div className="checkout-main">
          {/* Address */}
          <div className={`checkout-section ${step >= 1 ? 'checkout-section-active' : ''}`}>
            <h2>1. Delivery address</h2>
            {step === 1 ? (
              <div className="checkout-address-form">
                <div className="form-group"><label className="form-label">Full name</label><input className="form-input" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={address.line} onChange={e => setAddress({...address, line: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">City</label><input className="form-input" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">State</label><input className="form-input" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} required /></div>
                </div>
                <button className="btn-amazon" onClick={() => setStep(2)} disabled={!address.name || !address.line || !address.city}>Deliver to this address</button>
              </div>
            ) : (
              <div className="checkout-summary-line">
                <span>{address.name}, {address.line}, {address.city}, {address.state} {address.pincode}</span>
                <button className="btn-link" onClick={() => setStep(1)}>Change</button>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className={`checkout-section ${step >= 2 ? 'checkout-section-active' : ''}`}>
            <h2>2. Payment method</h2>
            {step >= 2 ? (
              step === 2 ? (
                <div className="checkout-payment-options">
                  <label className="payment-option"><input type="radio" name="pay" value="credit_card" checked={paymentMethod==='credit_card'} onChange={e=>setPaymentMethod(e.target.value)} /><span>Credit or debit card</span><span className="payment-icons">💳</span></label>
                  <label className="payment-option"><input type="radio" name="pay" value="netbanking" checked={paymentMethod==='netbanking'} onChange={e=>setPaymentMethod(e.target.value)} /><span>Net Banking</span></label>
                  <label className="payment-option"><input type="radio" name="pay" value="upi" checked={paymentMethod==='upi'} onChange={e=>setPaymentMethod(e.target.value)} /><span>UPI</span></label>
                  <label className="payment-option"><input type="radio" name="pay" value="cod" checked={paymentMethod==='cod'} onChange={e=>setPaymentMethod(e.target.value)} /><span>Cash on Delivery / Pay on Delivery</span></label>
                  <button className="btn-amazon" onClick={() => setStep(3)} style={{marginTop:12}}>Use this payment method</button>
                </div>
              ) : (
                <div className="checkout-summary-line">
                  <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'credit_card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}</span>
                  <button className="btn-link" onClick={() => setStep(2)}>Change</button>
                </div>
              )
            ) : <p className="checkout-inactive">Complete previous step first</p>}
          </div>

          {/* Review */}
          <div className={`checkout-section ${step >= 3 ? 'checkout-section-active' : ''}`}>
            <h2>3. Review items and shipping</h2>
            {step >= 3 ? (
              <div>
                <div className="checkout-delivery-date">Arriving <strong>{deliveryDate}</strong></div>
                {cartItems.map(item => (
                  <div key={item.product_id} className="checkout-item">
                    <div className="checkout-item-img">{item.image_url ? <img src={item.image_url} alt="" /> : <div className="placeholder-img" style={{width:80,height:80}}>📦</div>}</div>
                    <div className="checkout-item-info">
                      <div className="checkout-item-title">{item.title}</div>
                      <div className="checkout-item-price">₹{formatPrice(item.price)}</div>
                      <div className="checkout-item-qty">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
                {error && <div className="signin-error" style={{marginTop:12}}>{error}</div>}
                <button className="btn-amazon btn-amazon-lg" onClick={handlePlaceOrder} disabled={processing} style={{maxWidth:300,marginTop:16}}>
                  {processing ? 'Processing...' : 'Place your order'}
                </button>
                <p style={{fontSize:12,color:'var(--text-secondary)',marginTop:8}}>Order Total: ₹{formatPrice(orderTotal)}</p>
              </div>
            ) : <p className="checkout-inactive">Complete previous steps first</p>}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="checkout-sidebar">
          <button className="btn-amazon btn-amazon-lg" onClick={step === 3 ? handlePlaceOrder : () => setStep(Math.min(step+1, 3))} disabled={processing}>
            {step === 3 ? (processing ? 'Processing...' : 'Place your order') : 'Continue'}
          </button>
          <p className="checkout-legal">By placing your order, you agree to Amazon's <Link href="#">privacy notice</Link> and <Link href="#">conditions of use</Link>.</p>
          <div className="checkout-divider" />
          <h3>Order Summary</h3>
          <div className="checkout-summary-row"><span>Items:</span><span>₹{formatPrice(cartTotal)}</span></div>
          <div className="checkout-summary-row"><span>Delivery:</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="checkout-divider" />
          <div className="checkout-summary-row checkout-summary-total"><span>Order Total:</span><span>₹{formatPrice(orderTotal)}</span></div>
        </aside>
      </div>
    </div>
  );
}
