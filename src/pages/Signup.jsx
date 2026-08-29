import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import AIOrb from '../components/ai/AIOrb.jsx';
import './Auth.css';

const industries = [
  'Select industry',
  'Manufacturing',
  'Technology',
  'Construction',
  'Food & Beverage',
  'Textiles',
  'Automotive',
  'Healthcare',
  'Electronics',
  'Chemical',
  'Other',
];

const roles = [
  'Select role',
  'Product Manager',
  'Quality Manager',
  'Compliance Officer',
  'Engineer',
  'Consultant',
  'Researcher',
  'Student',
  'Other',
];

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    organization: '', industry: 'Select industry', role: 'Select role',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useApp();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length === 0 ? 0 :
    form.password.length < 6 ? 1 :
    form.password.length < 10 ? 2 : 3;

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left__content">
          <div className="auth-left__brand">
            <div className="auth-left__logo"><Zap size={20} /></div>
            <span className="auth-left__brand-name">BIS SmartAI</span>
          </div>
          <div className="auth-left__orb">
            <AIOrb size="lg" animated />
          </div>
          <div className="auth-left__text">
            <h2>Start your compliance intelligence journey</h2>
            <p>Join BIS SmartAI and get AI-powered insights into Indian Standards and BIS compliance.</p>
          </div>
          <div className="auth-left__disclaimer">Not an official BIS website.</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">Join BIS SmartAI for free</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <input id="signup-name" type="text" className="form-input" placeholder="Your full name"
                  value={form.name} onChange={set('name')} required autoComplete="name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email</label>
                <input id="signup-email" type="email" className="form-input" placeholder="you@company.com"
                  value={form.email} onChange={set('email')} required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <div className="auth-password-label">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <span className={`auth-strength-label auth-strength-label--${['', 'weak', 'medium', 'strong'][passwordStrength]}`}>
                  {['', 'Weak', 'Medium', 'Strong'][passwordStrength]}
                </span>
              </div>
              <div className="auth-password-field">
                <input id="signup-password" type={showPassword ? 'text' : 'password'}
                  className="form-input auth-password-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={set('password')} required minLength={6} />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordStrength > 0 && (
                <div className="auth-strength-bar">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`auth-strength-segment ${i <= passwordStrength ? `auth-strength-segment--${['', 'weak', 'medium', 'strong'][passwordStrength]}` : ''}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <input id="signup-confirm" type="password" className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-org">Organization</label>
              <input id="signup-org" type="text" className="form-input" placeholder="Company or institution"
                value={form.organization} onChange={set('organization')} />
            </div>

            <div className="auth-form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-industry">Industry</label>
                <select id="signup-industry" className="form-input form-select" value={form.industry} onChange={set('industry')}>
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-role">Role</label>
                <select id="signup-role" className="form-input form-select" value={form.role} onChange={set('role')}>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-gradient w-full auth-submit" disabled={loading} id="signup-submit">
              {loading ? (
                <span className="auth-loading"><span className="auth-spinner" />Creating account...</span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link" id="goto-login">Sign in</Link>
          </p>

          <p className="auth-terms-text">
            By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
