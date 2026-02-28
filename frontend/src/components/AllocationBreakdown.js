import React from 'react';
import './AllocationBreakdown.css';

function AllocationBreakdown({ breakdown, blendedAllocation }) {
  if (!breakdown || breakdown.length === 0) return null;

  const assets = ['stocks', 'bonds', 'cash'];

  return (
    <div className="card allocation-breakdown">
      <h2>How Your Goals Shaped This Allocation</h2>
      <p className="breakdown-subtitle">
        Each goal has its own ideal allocation based on its time horizon.
        The final portfolio is a weighted blend by dollar value and priority.
      </p>

      <div className="breakdown-table-wrapper">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Time Horizon</th>
              <th>Stocks</th>
              <th>Bonds</th>
              <th>Cash</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row, i) => (
              <tr key={i}>
                <td className="goal-cell">{row.goal_name}</td>
                <td className="horizon-cell">{row.time_horizon_years} yrs</td>
                {assets.map((a) => (
                  <td key={a} className="alloc-cell">
                    <span
                      className="alloc-bar"
                      style={{ width: `${row.allocation[a] || 0}%` }}
                    />
                    {row.allocation[a] || 0}%
                  </td>
                ))}
                <td className="weight-cell">{row.weight_pct}%</td>
              </tr>
            ))}
          </tbody>
          {blendedAllocation && (
            <tfoot>
              <tr className="blended-row">
                <td colSpan={2}>Blended Result</td>
                {assets.map((a) => (
                  <td key={a} className="alloc-cell blended-val">
                    <span
                      className="alloc-bar blended-bar"
                      style={{ width: `${blendedAllocation[a] || 0}%` }}
                    />
                    {blendedAllocation[a] || 0}%
                  </td>
                ))}
                <td className="weight-cell">100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default AllocationBreakdown;
