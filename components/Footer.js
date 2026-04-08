'use client';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <button className="back-to-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>Back to top</button>
      <div className="footer-main">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Get to Know Us</h4>
            <Link href="#">About Amazon</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Press Releases</Link>
            <Link href="#">Amazon Science</Link>
          </div>
          <div className="footer-col">
            <h4>Connect with Us</h4>
            <Link href="#">Facebook</Link>
            <Link href="#">Twitter</Link>
            <Link href="#">Instagram</Link>
          </div>
          <div className="footer-col">
            <h4>Make Money with Us</h4>
            <Link href="#">Sell on Amazon</Link>
            <Link href="#">Sell under Amazon Accelerator</Link>
            <Link href="#">Protect and Build Your Brand</Link>
            <Link href="#">Amazon Global Selling</Link>
            <Link href="#">Become an Affiliate</Link>
            <Link href="#">Fulfilment by Amazon</Link>
            <Link href="#">Advertise Your Products</Link>
            <Link href="#">Amazon Pay on Merchants</Link>
          </div>
          <div className="footer-col">
            <h4>Let Us Help You</h4>
            <Link href="#">Your Account</Link>
            <Link href="#">Returns Centre</Link>
            <Link href="#">100% Purchase Protection</Link>
            <Link href="#">Amazon App Download</Link>
            <Link href="#">Help</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <Link href="/" className="footer-logo">amazon<span>.in</span></Link>
          <div className="footer-bottom-links">
            <span>English</span>
            <span>India</span>
          </div>
        </div>
        <div className="footer-legal">
          <Link href="#">Conditions of Use & Sale</Link>
          <Link href="#">Privacy Notice</Link>
          <Link href="#">Interest-Based Ads</Link>
          <span>© 1996-2026, Amazon.com, Inc. or its affiliates</span>
        </div>
      </div>
    </footer>
  );
}
