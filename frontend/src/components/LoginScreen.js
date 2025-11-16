import React, { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin, onCreateNew, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    try {
      await onLogin(email.trim(), password.trim());
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again or create a new profile.');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Financial Planning Application</h1>
        <p className="subtitle">Welcome! Please sign in or create a new profile</p>

        <div className="login-options">
          <div className="login-section">
            <h2>Sign In</h2>
            <p className="section-description">Enter your email and password to sign in</p>
            
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="button primary"
                disabled={loading || !email.trim() || !password.trim()}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="create-section">
            <h2>New User?</h2>
            <p className="section-description">Create a new profile to get started</p>
            <button 
              className="button secondary"
              onClick={onCreateNew}
              disabled={loading}
            >
              Create New Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

