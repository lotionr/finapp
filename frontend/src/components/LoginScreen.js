import React, { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin, onCreateNew, loading }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      await onLogin(email.trim());
    } catch (err) {
      setError('User not found. Please check your email or create a new profile.');
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
            <p className="section-description">Enter your email to load your existing profile</p>
            
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
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="button primary"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Loading...' : 'Load Profile'}
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

