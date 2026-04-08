'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './signin.css';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page-white">
      <div className="signin-header">
        <Link href="/" className="signin-logo">amazon<span>.in</span></Link>
      </div>
      <div className="signin-container">
        <div className="signin-box">
          <h1>{isRegister ? 'Create account' : 'Sign in'}</h1>
          {error && <div className="signin-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Your name</label>
                <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={4} />
            </div>
            <button type="submit" className="btn-amazon btn-amazon-lg" disabled={loading} style={{marginTop:8}}>
              {loading ? 'Please wait...' : isRegister ? 'Create your Amazon account' : 'Sign in'}
            </button>
          </form>
          {!isRegister && (
            <div className="signin-demo">
              <p>Demo: <strong>demo@amazon.in</strong> / <strong>demo1234</strong></p>
            </div>
          )}
          <div className="signin-divider"><span>New to Amazon?</span></div>
          <button className="btn-outline" style={{width:'100%'}} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Sign in' : 'Create your Amazon account'}
          </button>
        </div>
      </div>
      <div className="signin-footer-line" />
      <div className="signin-footer">
        <Link href="#">Conditions of Use</Link>
        <Link href="#">Privacy Notice</Link>
        <Link href="#">Help</Link>
        <span>© 1996-2026, Amazon.com, Inc.</span>
      </div>
    </div>
  );
}
