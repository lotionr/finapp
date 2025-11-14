import React, { useState, useEffect } from 'react';
import './PortfolioAdjustment.css';

function PortfolioAdjustment({ user, portfolio, onAnalyze, onUpdate, loading = false }) {
  const [goals, setGoals] = useState([
    { goal_name: '', target_amount: '', target_date: '', priority: 'medium' }
  ]);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [allocation, setAllocation] = useState(
    portfolio?.allocation || { stocks: 0, bonds: 0, cash: 0 }
  );
  const [mode, setMode] = useState('analyze'); // 'analyze' or 'manual'

  useEffect(() => {
    if (portfolio) {
      setAllocation(portfolio.allocation);
    }
  }, [portfolio]);

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const addGoal = () => {
    setGoals([...goals, { goal_name: '', target_amount: '', target_date: '', priority: 'medium' }]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleAllocationChange = (asset, value) => {
    const newAllocation = { ...allocation };
    newAllocation[asset] = parseFloat(value) || 0;
    setAllocation(newAllocation);
  };

  const handleAnalyze = () => {
    const validGoals = goals.filter(g => g.goal_name && g.target_amount && g.target_date);
    if (validGoals.length === 0) {
      alert('Please add at least one financial goal with all fields filled out');
      return;
    }
    
    // Validate that all required fields are filled
    const incompleteGoals = validGoals.filter(g => !g.goal_name || !g.target_amount || !g.target_date);
    if (incompleteGoals.length > 0) {
      alert('Please fill out all fields for each goal (name, amount, and date)');
      return;
    }
    
    console.log('Calling onAnalyze with:', { goals: validGoals, timeHorizon });
    onAnalyze(validGoals, timeHorizon);
  };

  const handleManualUpdate = () => {
    const total = Object.values(allocation).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    if (Math.abs(total - 100) > 0.01) {
      alert(`Total allocation must equal 100%. Current total: ${total.toFixed(2)}%`);
      return;
    }
    onUpdate(allocation);
  };

  const totalAllocation = Object.values(allocation).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="card portfolio-adjustment">
      <h2>Portfolio Configuration</h2>
      
      <div className="mode-selector">
        <button
          className={`mode-button ${mode === 'analyze' ? 'active' : ''}`}
          onClick={() => setMode('analyze')}
        >
          AI Analysis
        </button>
        <button
          className={`mode-button ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          Manual Adjustment
        </button>
      </div>

      {mode === 'analyze' ? (
        <div className="analyze-mode">
          <div className="input-group">
            <label htmlFor="time_horizon">Time Horizon (years)</label>
            <input
              type="number"
              id="time_horizon"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
              min="1"
              max="50"
              required
            />
          </div>

          <div className="goals-section">
            <h3>Financial Goals</h3>
            {goals.map((goal, index) => (
              <div key={index} className="goal-item">
                <div className="goal-row">
                  <div className="input-group">
                    <label>Goal Name</label>
                    <input
                      type="text"
                      value={goal.goal_name}
                      onChange={(e) => handleGoalChange(index, 'goal_name', e.target.value)}
                      placeholder="e.g., Retirement, House Down Payment"
                    />
                  </div>
                  <div className="input-group">
                    <label>Target Amount ($)</label>
                    <input
                      type="number"
                      value={goal.target_amount}
                      onChange={(e) => handleGoalChange(index, 'target_amount', e.target.value)}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
                <div className="goal-row">
                  <div className="input-group">
                    <label>Target Date</label>
                    <input
                      type="date"
                      value={goal.target_date}
                      onChange={(e) => handleGoalChange(index, 'target_date', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Priority</label>
                    <select
                      value={goal.priority}
                      onChange={(e) => handleGoalChange(index, 'priority', e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  {goals.length > 1 && (
                    <button
                      className="remove-goal-button"
                      onClick={() => removeGoal(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className="button secondary" onClick={addGoal}>
              + Add Goal
            </button>
          </div>

          <button 
            className="button primary" 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze & Generate Allocation'}
          </button>
        </div>
      ) : (
        <div className="manual-mode">
          <h3>Manual Allocation</h3>
          <p className="hint">Adjust percentages (must total 100%)</p>
          
          {Object.keys(allocation).map((asset) => (
            <div key={asset} className="input-group">
              <label htmlFor={asset}>
                {asset.charAt(0).toUpperCase() + asset.slice(1)} (%)
              </label>
              <input
                type="number"
                id={asset}
                value={allocation[asset]}
                onChange={(e) => handleAllocationChange(asset, e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          ))}

          <div className={`total-display ${Math.abs(totalAllocation - 100) < 0.01 ? 'valid' : 'invalid'}`}>
            Total: {totalAllocation.toFixed(2)}%
          </div>

          <button
            className="button primary"
            onClick={handleManualUpdate}
            disabled={Math.abs(totalAllocation - 100) > 0.01}
          >
            Update Portfolio
          </button>
        </div>
      )}
    </div>
  );
}

export default PortfolioAdjustment;

