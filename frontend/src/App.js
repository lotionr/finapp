import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import PortfolioDisplay from './components/PortfolioDisplay';
import PortfolioAdjustment from './components/PortfolioAdjustment';
import FinancialPlan from './components/FinancialPlan';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [financialPlan, setFinancialPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  // Load user profile on mount if userId exists in localStorage
  useEffect(() => {
    const loadSavedUser = async () => {
      try {
        const savedUserId = localStorage.getItem('userId');
        if (savedUserId) {
          const userData = await api.getUser(savedUserId);
          setUser(userData);
          setShowLogin(false);
          setShowCreateProfile(false);
          // Try to load portfolio
          try {
            const portfolioData = await api.getPortfolio(savedUserId);
            setPortfolio(portfolioData);
          } catch (e) {
            // Portfolio doesn't exist yet, that's okay
          }
        }
      } catch (err) {
        // User not found, clear localStorage and show login
        localStorage.removeItem('userId');
        setShowLogin(true);
      }
    };
    loadSavedUser();
  }, []);

  const handleLogin = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await api.getUserByEmail(email);
      setUser(userData);
      localStorage.setItem('userId', userData.id);
      setShowLogin(false);
      setShowCreateProfile(false);
      // Try to load portfolio
      try {
        const portfolioData = await api.getPortfolio(userData.id);
        setPortfolio(portfolioData);
      } catch (e) {
        // Portfolio doesn't exist yet, that's okay
      }
    } catch (err) {
      throw err; // Re-throw to let LoginScreen handle it
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShowLogin(false);
    setShowCreateProfile(true);
    setError(null);
  };

  const handleUserCreate = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await api.createUser(userData);
      setUser(newUser);
      localStorage.setItem('userId', newUser.id);
      setShowCreateProfile(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setPortfolio(null);
    setFinancialPlan(null);
    setShowLogin(true);
    setShowCreateProfile(false);
    setError(null);
  };

  const handlePortfolioAnalyze = async (goals, timeHorizon) => {
    if (!user) {
      setError('Please create a user profile first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Format goals for API (convert strings to proper types)
      const formattedGoals = goals.map(goal => ({
        user_id: user.id,
        goal_name: goal.goal_name,
        target_amount: parseFloat(goal.target_amount) || 0,
        target_date: goal.target_date,
        priority: goal.priority
      }));

      console.log('Analyzing portfolio with:', { user_id: user.id, goals: formattedGoals, time_horizon: timeHorizon });
      
      const allocation = await api.analyzePortfolio({
        user_id: user.id,
        goals: formattedGoals,
        time_horizon: timeHorizon
      });
      
      console.log('Allocation received:', allocation);
      
      // Update or create portfolio
      const portfolioData = await api.updatePortfolio(user.id, {
        allocation: allocation.allocation
      });
      setPortfolio(portfolioData);
      console.log('Portfolio updated:', portfolioData);
    } catch (err) {
      console.error('Portfolio analysis error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to analyze portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioUpdate = async (newAllocation) => {
    if (!user) {
      setError('Please create a user profile first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedPortfolio = await api.updatePortfolio(user.id, {
        allocation: newAllocation
      });
      setPortfolio(updatedPortfolio);
    } catch (err) {
      setError(err.message || 'Failed to update portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (goals) => {
    if (!user || !portfolio) {
      setError('Please create a user profile and portfolio first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const plan = await api.generatePlan({
        user_id: user.id,
        goals: goals
      });
      setFinancialPlan(plan.summary);
    } catch (err) {
      setError(err.message || 'Failed to generate financial plan');
    } finally {
      setLoading(false);
    }
  };

  // Show login screen if no user and not creating profile
  if (showLogin && !user && !showCreateProfile) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onCreateNew={handleCreateNew}
        loading={loading}
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial Planning Application</h1>
        <p>Asset Allocation & Portfolio Management</p>
        {user && (
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Sign out and return to login"
          >
            Sign Out
          </button>
        )}
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        {loading && <div className="loading">Loading...</div>}

        {showCreateProfile ? (
          <UserProfile onSubmit={handleUserCreate} />
        ) : user ? (
          <>
            <div className="user-info">
              <h2>Welcome, {user.name}!</h2>
              <p>Email: {user.email} | Risk Profile: {user.risk_profile} | Age: {user.age} | Savings: ${user.current_savings.toLocaleString()}</p>
            </div>

            {!portfolio ? (
              <PortfolioAdjustment
                user={user}
                onAnalyze={handlePortfolioAnalyze}
                onUpdate={handlePortfolioUpdate}
                loading={loading}
              />
            ) : (
              <>
                <PortfolioDisplay portfolio={portfolio} />
                <PortfolioAdjustment
                  user={user}
                  portfolio={portfolio}
                  onAnalyze={handlePortfolioAnalyze}
                  onUpdate={handlePortfolioUpdate}
                  loading={loading}
                />
                <FinancialPlan
                  user={user}
                  portfolio={portfolio}
                  onGenerate={handleGeneratePlan}
                  plan={financialPlan}
                />
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;

