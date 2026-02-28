import React, { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import PortfolioDisplay from './components/PortfolioDisplay';
import PortfolioAdjustment from './components/PortfolioAdjustment';
import FinancialPlan from './components/FinancialPlan';
import GoalFeasibility from './components/GoalFeasibility';
import ProjectionChart from './components/ProjectionChart';
import AllocationBreakdown from './components/AllocationBreakdown';
import EditProfile from './components/EditProfile';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [financialPlan, setFinancialPlan] = useState(null);
  const [goalFeasibility, setGoalFeasibility] = useState(null);
  const [expectedReturn, setExpectedReturn] = useState(null);
  const [projection, setProjection] = useState(null);
  const [goalAllocationBreakdown, setGoalAllocationBreakdown] = useState(null);
  const [savedGoals, setSavedGoals] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
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

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await api.login(email, password);
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
    setGoalFeasibility(null);
    setExpectedReturn(null);
    setProjection(null);
    setGoalAllocationBreakdown(null);
    setSavedGoals(null);
    setShowLogin(true);
    setShowCreateProfile(false);
    setError(null);
  };

  const handleUserUpdate = async (updatedData) => {
    setError(null);
    try {
      const updatedUser = await api.updateUser(user.id, updatedData);
      setUser(updatedUser);
      setShowEditProfile(false);

      // Re-run full analysis with updated profile so all charts and
      // feasibility cards reflect the new income, savings, risk profile, etc.
      if (savedGoals && savedGoals.length > 0) {
        await handlePortfolioAnalyze(savedGoals);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to update profile');
    }
  };

  const handlePortfolioAnalyze = async (goals) => {
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

      const allocation = await api.analyzePortfolio({
        user_id: user.id,
        goals: formattedGoals,
      });

      // Persist goals so downstream components don't need to re-enter them
      setSavedGoals(formattedGoals);

      // Store feasibility, projection, and breakdown results
      setGoalFeasibility(allocation.goal_feasibility || []);
      setExpectedReturn(allocation.expected_return || null);
      setProjection(allocation.projection || []);
      setGoalAllocationBreakdown(allocation.goal_allocation_breakdown || []);

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

      // If we have saved goals, recompute feasibility against the new allocation
      if (savedGoals && savedGoals.length > 0) {
        const feasibility = await api.computeFeasibility({
          user_id: user.id,
          allocation: newAllocation,
          goals: savedGoals,
        });
        setGoalFeasibility(feasibility.goal_feasibility || []);
        setExpectedReturn(feasibility.expected_return || null);
        setProjection(feasibility.projection || []);
      }
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
      // Ensure every goal carries user_id and numeric target_amount
      const formattedGoals = goals.map(g => ({
        user_id: user.id,
        goal_name: g.goal_name,
        target_amount: parseFloat(g.target_amount) || 0,
        target_date: g.target_date,
        priority: g.priority,
      }));
      const plan = await api.generatePlan({
        user_id: user.id,
        goals: formattedGoals,
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
          <div className="header-actions">
            <button className="header-btn" onClick={() => setShowEditProfile(true)}>
              Edit Profile
            </button>
            <button className="header-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}
        
        {loading && <div className="loading">Loading...</div>}

        {showCreateProfile ? (
          <UserProfile onSubmit={handleUserCreate} />
        ) : showEditProfile && user ? (
          <EditProfile
            user={user}
            onSave={handleUserUpdate}
            onCancel={() => setShowEditProfile(false)}
          />
        ) : user ? (
          <>
            {!portfolio ? (
              <PortfolioAdjustment
                user={user}
                initialGoals={savedGoals}
                onAnalyze={handlePortfolioAnalyze}
                onUpdate={handlePortfolioUpdate}
                loading={loading}
              />
            ) : (
              <>
                <PortfolioDisplay portfolio={portfolio} />
                {goalAllocationBreakdown && goalAllocationBreakdown.length > 0 && (
                  <AllocationBreakdown
                    breakdown={goalAllocationBreakdown}
                    blendedAllocation={portfolio?.allocation}
                  />
                )}
                {goalFeasibility && goalFeasibility.length > 0 && (
                  <GoalFeasibility
                    feasibility={goalFeasibility}
                    expectedReturn={expectedReturn}
                  />
                )}
                {projection && projection.length > 0 && (
                  <ProjectionChart
                    projection={projection}
                    feasibility={goalFeasibility}
                  />
                )}
                <PortfolioAdjustment
                  user={user}
                  portfolio={portfolio}
                  initialGoals={savedGoals}
                  onAnalyze={handlePortfolioAnalyze}
                  onUpdate={handlePortfolioUpdate}
                  loading={loading}
                />
                <FinancialPlan
                  user={user}
                  portfolio={portfolio}
                  initialGoals={savedGoals}
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

