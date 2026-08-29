import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import authService from '../services/authService.js';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--center">
      <div className="auth-form-container auth-form-container--centered">
        <div className="auth-left__brand" style={{ marginBottom: '24px', justifyContent: 'center' }}>
          <div className="auth-left__logo"><Zap size={20} /></div>
          <span className="auth-left__brand-name">BIS SmartAI</span>
        </div>

        {!sent ? (
          <>
            <div className="auth-form-header">
              <h1 className="auth-form-title">Reset password</h1>
              <p className="auth-form-subtitle">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="btn btn-gradient w-full auth-submit" disabled={loading} id="forgot-submit">
                {loading ? (
                  <span className="auth-loading"><span className="auth-spinner" />Sending...</span>
                ) : (
                  <>Send Reset Link <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <CheckCircle size={32} />
            </div>
            <h2>Check your email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong>. (Demo — no actual email sent.)</p>
            <Link to="/login" className="btn btn-secondary w-full" id="back-to-login">
              Back to Sign In
            </Link>
          </div>
        )}

        <p className="auth-footer-text" style={{ textAlign: 'center' }}>
          <Link to="/login" className="auth-link flex items-center gap-1 justify-center" id="back-login-link">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
