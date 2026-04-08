'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubNav from '@/components/SubNav';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import './product.css';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product);
        setSimilar(data.similar || []);
      })
      .catch(() => {});
  }, [id]);

  if (!product) return (
    <div className="page-white">
      <Navbar /><SubNav />
      <div style={{textAlign:'center',padding:'80px 20px'}}>Loading...</div>
    </div>
  );

  const images = (() => { try { return JSON.parse(product.images); } catch { return [product.image_url]; } })();
  const specs = (() => { try { return JSON.parse(product.specifications); } catch { return {}; } })();
  const features = (() => { try { return JSON.parse(product.features); } catch { return []; } })();
  const formatPrice = (p) => Number(p).toLocaleString('en-IN');
  const deliveryDate = new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = '/cart';
  };

  return (
    <div className="page-white">
      <Navbar /><SubNav />
      <div className="pdp-breadcrumb">
        <Link href="/">Home</Link> › <Link href={`/search?category=${product.category}`}>{product.category}</Link> › <span>{product.subcategory}</span>
      </div>
      <div className="pdp-container">
        {/* Left: Images */}
        <div className="pdp-images">
          <div className="pdp-thumbnails">
            {images.map((img, i) => (
              <div key={i} className={`pdp-thumb ${i === selectedImg ? 'pdp-thumb-active' : ''}`} onMouseEnter={() => setSelectedImg(i)}>
                {img ? <img src={img} alt="" /> : <div className="placeholder-img" style={{width:'100%',height:'100%'}}>📷</div>}
              </div>
            ))}
          </div>
          <div className="pdp-main-image">
            {images[selectedImg] ? <img src={images[selectedImg]} alt={product.title} /> : <div className="placeholder-img" style={{height:400,width:'100%',fontSize:60}}>📦</div>}
          </div>
        </div>

        {/* Center: Details */}
        <div className="pdp-details">
          <h1 className="pdp-title">{product.title}</h1>
          <div className="pdp-brand">
            Visit the <Link href={`/search?brand=${product.brand}`}>{product.brand} Store</Link>
          </div>
          <div className="pdp-rating">
            <span className="pdp-rating-num">{product.rating}</span>
            <StarRating rating={product.rating} count={product.review_count} size="md" />
          </div>
          {product.bought_past_month > 100 && (
            <div className="pdp-bought">{product.bought_past_month >= 1000 ? `${(product.bought_past_month/1000).toFixed(0)}K+` : `${product.bought_past_month}+`} bought in past month</div>
          )}
          <div className="pdp-divider" />
          <div className="pdp-price-section">
            {product.discount_percent > 0 && <span className="pdp-discount">-{product.discount_percent}%</span>}
            <span className="pdp-price-symbol">₹</span>
            <span className="pdp-price-whole">{formatPrice(product.price)}</span>
          </div>
          {product.mrp > product.price && (
            <div className="pdp-mrp">M.R.P.: <span className="pdp-mrp-value">₹{formatPrice(product.mrp)}</span></div>
          )}
          {product.is_fulfilled ? <div style={{marginTop:4}}><span className="badge-fulfilled">Fulfilled</span></div> : null}
          <div className="pdp-tax">Inclusive of all taxes</div>
          <div className="pdp-emi">EMI starts at ₹{Math.round(product.price/12).toLocaleString('en-IN')}. No Cost EMI available</div>

          {Object.keys(specs).length > 0 && (
            <table className="pdp-specs">
              <tbody>
                {Object.entries(specs).map(([k,v]) => (
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          {features.length > 0 && (
            <div className="pdp-about">
              <h3>About this item</h3>
              <ul>
                {features.map((f,i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Buy Box */}
        <div className="pdp-buybox">
          <div className="pdp-buybox-price">
            <span className="pdp-price-symbol">₹</span>
            <span className="pdp-price-whole">{formatPrice(product.price)}</span>
          </div>
          <div className="pdp-delivery">
            FREE scheduled delivery as soon as <strong>{deliveryDate}</strong>
          </div>
          <div className="pdp-stock" style={{color: product.stock > 0 ? 'var(--color-in-stock)' : '#CC0C39'}}>
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </div>
          <div className="pdp-shipped">Ships from <strong>Amazon</strong></div>
          <div className="pdp-qty-row">
            <label>Quantity:</label>
            <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
              {[...Array(Math.min(10, product.stock))].map((_,i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
          </div>
          <button className="btn-amazon btn-amazon-lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
            {added ? '✓ Added to Cart' : 'Add to cart'}
          </button>
          <button className="btn-buy-now btn-buy-now-lg" onClick={handleBuyNow} disabled={product.stock <= 0} style={{marginTop:8}}>
            Buy Now
          </button>
          <button className="btn-outline" style={{width:'100%',marginTop:8}}>
            Add to Wish List
          </button>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="pdp-similar">
          <h2>Products related to this item</h2>
          <div className="deals-scroll" style={{background:'#fff'}}>
            {similar.map(p => (
              <div key={p.id} className="deal-card-wrapper">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
