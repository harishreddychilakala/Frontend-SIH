import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { HeroCarousel } from '../components/ui/HeroCarousel.jsx';
import './Auth.css';

/* BIS-relevant showcase slides — verified Unsplash photo IDs */
const BIS_HERO_SLIDES = [
  {
    id: 'steel',
    title: 'IS 1786\nTMT Steel Bars',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS SCHEME I · QCO MANDATORY',
    meta: ['MANDATORY', 'ISI MARK', 'SCHEME I'],
    accent: '#d97706',
  },
  {
    id: 'led',
    title: 'IS 16102\nLED Luminaires',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS SCHEME II · CRS MANDATORY',
    meta: ['MANDATORY', 'CRS MARK', 'SCHEME II'],
    accent: '#0ea5e9',
  },
  {
    id: 'battery',
    title: 'IS 16046\nLi-Ion Batteries',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS CERTIFIED · SAFETY TESTED',
    meta: ['MANDATORY', 'SAFETY', 'SCHEME II'],
    accent: '#7c3aed',
  },
  {
    id: 'kettles',
    title: 'IS 302-2-15\nElectric Kettles',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS SCHEME I · HOUSEHOLD',
    meta: ['MANDATORY', 'ISI MARK', 'SCHEME I'],
    accent: '#059669',
  },
  {
    id: 'electronics',
    title: 'IS 13252\nIT Equipment',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS SCHEME II · ELECTRONICS',
    meta: ['MANDATORY', 'CRS MARK', 'SCHEME II'],
    accent: '#2563eb',
  },
  {
    id: 'cement',
    title: 'IS 269\nPortland Cement',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=1200&fit=crop&q=80&auto=format',
    credit: 'BIS SCHEME I · CONSTRUCTION',
    meta: ['MANDATORY', 'ISI MARK', 'SCHEME I'],
    accent: '#78716c',
  },
];

export default function Login() {
  const [email, setEmail] = useState('demo@bissmartai.in');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullscreen">

      {/* ── Full-bleed background carousel — NEVER TOUCH THIS ── */}
      <div className="auth-bg-carousel">
        <HeroCarousel
          items={BIS_HERO_SLIDES}
          defaultIndex={0}
          autoplay
          autoplayDelay={4500}
          className="auth-bg-carousel__inner"
        />
      </div>

      {/* ── Glassmorphism login card, centred over the background ── */}
      <div className="auth-glass-overlay">

        {/* Brand pill at the top */}
        <div className="auth-glass-brand">
          <div className="auth-glass-brand-icon">
            <Shield size={14} />
          </div>
          <span>BIS SmartAI</span>
        </div>

        {/* Card */}
        <div className="auth-glass-card">
          {/* Card header */}
          <div className="auth-glass-header">
            <div>
              <h1 className="auth-glass-title">Login to your account</h1>
              <p className="auth-glass-subtitle">Enter your email below to login to your account</p>
            </div>
            <Link to="/signup" className="auth-glass-signup-link">Sign Up</Link>
          </div>

          {error && (
            <div className="auth-glass-error" role="alert">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-glass-form" noValidate>
            {/* Email */}
            <div className="auth-glass-field">
              <label className="auth-glass-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="auth-glass-input"
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="auth-glass-field">
              <div className="auth-glass-pw-row">
                <label className="auth-glass-label" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="auth-glass-forgot">Forgot your password?</Link>
              </div>
              <div className="auth-glass-pw-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-glass-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-glass-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-glass-submit"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="auth-glass-loading">
                  <span className="auth-glass-spinner" />
                  Signing in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="auth-glass-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-glass-footer-link" id="goto-signup">Sign up free</Link>
          </p>
        </div>

        <p className="auth-glass-disclaimer">Not an official Bureau of Indian Standards website.</p>
      </div>
    </div>
  );
}
