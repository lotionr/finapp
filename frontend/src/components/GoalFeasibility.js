import React from 'react';
import './GoalFeasibility.css';

const fmt = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function GoalFeasibility({ feasibility, expectedReturn }) {
  if (!feasibility || feasibility.length === 0) return null;

  const monthlySet = feasibility[0]?.assumed_monthly_contribution > 0;

  return (
    <div className="card goal-feasibility">
      <h2>Goal Feasibility Analysis</h2>
      {monthlySet ? (
        <p className="feasibility-subtitle">
          Based on your current savings, a <strong>{(expectedReturn * 100).toFixed(1)}%</strong> expected
          annual return, and <strong>{fmt(feasibility[0].assumed_monthly_contribution)}/mo</strong> in contributions.
        </p>
      ) : (
        <p className="feasibility-subtitle feasibility-warning">
          No monthly savings set — projections show current savings only.
          Set your monthly savings in <strong>Edit Profile</strong> for accurate results.
        </p>
      )}

      <div className="goal-cards">
        {feasibility.map((goal, i) => (
          <div key={i} className={`goal-card ${goal.on_track ? 'on-track' : 'off-track'}`}>
            <div className="goal-card-header">
              <h3>{goal.goal_name}</h3>
              <span className={`badge ${goal.on_track ? 'badge-success' : 'badge-danger'}`}>
                {goal.on_track ? 'On Track' : 'Off Track'}
              </span>
            </div>

            <div className="goal-card-body">
              <div className="goal-stat-row">
                <div className="goal-stat">
                  <span className="stat-label">Target</span>
                  <span className="stat-value">{fmt(goal.target_amount)}</span>
                </div>
                <div className="goal-stat">
                  <span className="stat-label">Time Horizon</span>
                  <span className="stat-value">{goal.years_to_goal} yrs</span>
                </div>
                <div className="goal-stat">
                  <span className="stat-label">Target Date</span>
                  <span className="stat-value">{goal.target_date}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span>Projected Value</span>
                  <span className={goal.on_track ? 'text-success' : 'text-danger'}>
                    {fmt(goal.projected_value)}
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill ${goal.on_track ? 'fill-success' : 'fill-danger'}`}
                    style={{ width: `${Math.min(100, (goal.projected_value / goal.target_amount) * 100).toFixed(1)}%` }}
                  />
                </div>
                <div className="progress-pct">
                  {Math.min(100, ((goal.projected_value / goal.target_amount) * 100)).toFixed(0)}% of goal
                </div>
              </div>

              <div className="goal-bottom-row">
                {goal.on_track ? (
                  <div className="surplus-box">
                    <span className="stat-label">Surplus</span>
                    <span className="stat-value text-success">{fmt(Math.abs(goal.shortfall))}</span>
                  </div>
                ) : (
                  <div className="surplus-box">
                    <span className="stat-label">Shortfall</span>
                    <span className="stat-value text-danger">{fmt(Math.abs(goal.shortfall))}</span>
                  </div>
                )}

                <div className="savings-box">
                  <span className="stat-label">Required monthly savings</span>
                  <span className="stat-value">{fmt(goal.required_monthly_savings)}/mo</span>
                  <span className="stat-note">
                    (currently saving {fmt(goal.assumed_monthly_contribution)}/mo)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalFeasibility;
