import React, { useState, useEffect } from 'react';
import './FinancialPlan.css';

const toDisplayGoal = (g) => ({
  goal_name: g.goal_name,
  target_amount: g.target_amount,
  target_date: g.target_date,
  priority: g.priority,
});

function FinancialPlan({ user, portfolio, initialGoals, onGenerate, plan }) {
  const [goals, setGoals] = useState(
    initialGoals && initialGoals.length > 0
      ? initialGoals.map(toDisplayGoal)
      : [{ goal_name: '', target_amount: '', target_date: '', priority: 'medium' }]
  );
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (initialGoals && initialGoals.length > 0) {
      setGoals(initialGoals.map(toDisplayGoal));
    }
  }, [initialGoals]);

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

  const handleGenerate = async () => {
    const validGoals = goals.filter(g => g.goal_name && g.target_amount && g.target_date);
    if (validGoals.length === 0) {
      alert('Please add at least one financial goal');
      return;
    }
    setGenerating(true);
    await onGenerate(validGoals);
    setGenerating(false);
  };

  return (
    <div className="card financial-plan">
      <h2>Financial Plan Summary</h2>
      
      {!plan ? (
        <div className="plan-input">
          <p className="description">
            Generate a comprehensive financial plan based on your profile and portfolio allocation.
          </p>

          {initialGoals && initialGoals.length > 0 && (
            <div className="goals-carried-over">
              Goals carried over from your portfolio analysis — edit if needed.
            </div>
          )}

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
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating Plan...' : 'Generate Financial Plan'}
          </button>
        </div>
      ) : (
        <div className="plan-display">
          <div className="plan-content">
            {plan.split('\n').map((paragraph, index) => (
              <p key={index} className="plan-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
          <button
            className="button secondary"
            onClick={() => window.location.reload()}
          >
            Generate New Plan
          </button>
        </div>
      )}
    </div>
  );
}

export default FinancialPlan;

