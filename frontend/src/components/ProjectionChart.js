import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import './ProjectionChart.css';

const GOAL_COLORS = ['#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea'];

const fmtDollar = (v) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(0)}K`
    : `$${v}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="proj-tooltip">
      <p className="proj-tooltip-year">{label}</p>
      <p className="proj-tooltip-value">
        Portfolio: <strong>{fmtDollar(payload[0].value)}</strong>
      </p>
    </div>
  );
};

function ProjectionChart({ projection, feasibility }) {
  if (!projection || projection.length === 0) return null;

  // Build goal markers: one per goal, keyed by year
  const goalMarkers = (feasibility || []).map((g, i) => ({
    year: parseInt(g.target_date.slice(0, 4), 10),
    label: g.goal_name,
    target: g.target_amount,
    color: GOAL_COLORS[i % GOAL_COLORS.length],
    on_track: g.on_track,
  }));

  return (
    <div className="card projection-chart">
      <h2>Portfolio Growth Projection</h2>
      <p className="proj-subtitle">
        Projected value based on current savings, a 20% savings rate, and your
        recommended portfolio's expected return.
      </p>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={projection} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 13 }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtDollar}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={70}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 12 }}
            formatter={() => 'Projected Portfolio Value'}
          />

          {/* Goal reference lines */}
          {goalMarkers.map((g, i) => (
            <ReferenceLine
              key={i}
              x={g.year}
              stroke={g.color}
              strokeDasharray="5 4"
              strokeWidth={2}
              label={{
                value: `${g.goal_name} (${fmtDollar(g.target)})`,
                position: 'insideTopRight',
                fontSize: 11,
                fill: g.color,
                offset: 6,
              }}
            />
          ))}

          <Line
            type="monotone"
            dataKey="value"
            stroke="#667eea"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: '#667eea' }}
            name="Projected Portfolio Value"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Goal legend below chart */}
      {goalMarkers.length > 0 && (
        <div className="proj-goal-legend">
          {goalMarkers.map((g, i) => (
            <div key={i} className="proj-goal-item">
              <span className="proj-goal-dot" style={{ background: g.color }} />
              <span className="proj-goal-name">{g.label}</span>
              <span className="proj-goal-target">{fmtDollar(g.target)} by {g.year}</span>
              <span className={`proj-goal-status ${g.on_track ? 'status-ok' : 'status-miss'}`}>
                {g.on_track ? 'On Track' : 'Off Track'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectionChart;
