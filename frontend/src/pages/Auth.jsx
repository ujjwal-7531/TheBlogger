import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const { user, login, register, loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (!isLogin) {
      if (!username || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please provide email/username and password.');
        return;
      }
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password); // Note: email field acts as identifier (email or username)
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page container">
      <div className="auth-card-container glass-card fade-in">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={20} className="glow-icon" />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to publish posts and write comments' : 'Join the blogging community today'}
          </p>
        </div>

        {error && (
          <div className="error-alert fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="john_doe"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{isLogin ? 'Email or Username' : 'Email Address'}</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? "john@example.com or john_doe" : "john@example.com"}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);
                setError('');
                await loginWithGoogle(credentialResponse.credential);
              } catch (err) {
                setError(err.message || 'Google Sign-In failed.');
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              setError('Google Sign-In was cancelled or failed.');
            }}
            theme="filled_dark"
            shape="pill"
            width="380"
          />
        </div>

        <div className="auth-toggle">
          <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button onClick={toggleMode} className="btn-toggle-link" disabled={loading}>
            {isLogin ? 'Sign Up Now' : 'Sign In Now'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }
        .auth-card-container {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem !important;
          border-radius: var(--radius-lg) !important;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
         .auth-logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #21262d;
          border: 1px solid #30363d;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        .glow-icon {
          color: var(--accent-primary);
        }
        .auth-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(248, 81, 73, 0.15);
          border: 1px solid rgba(248, 81, 73, 0.2);
          padding: 0.8rem;
          border-radius: var(--radius-sm);
          color: #f85149;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .input-icon-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .input-icon-wrapper input {
          padding-left: 2.5rem;
        }
        .btn-auth-submit {
          width: 100%;
          margin-top: 0.5rem;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .auth-divider:not(:empty)::before {
          margin-right: .75em;
        }
        .auth-divider:not(:empty)::after {
          margin-left: .75em;
        }
        .google-login-container {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        .auth-toggle {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .btn-toggle-link {
          background: transparent;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
          padding: 0;
          transition: color var(--transition-fast);
        }
        .btn-toggle-link:hover {
          color: var(--accent-secondary);
          text-decoration: underline;
        }
      `}} />
    </div>
  );
};

export default Auth;
