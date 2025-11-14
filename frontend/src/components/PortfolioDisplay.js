import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './PortfolioDisplay.css';

const COLORS = {
  stocks: '#667eea',
  bonds: '#48bb78',
  cash: '#ed8936',
  real_estate: '#9f7aea',
  commodities: '#f56565'
};

function PortfolioDisplay({ portfolio }) {
  if (!portfolio || !portfolio.allocation) {
    return null;
  }

  const data = Object.entries(portfolio.allocation).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value)
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card portfolio-display">
      <h2>Current Portfolio Allocation</h2>
      
      <div className="portfolio-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="allocation-details">
          <h3>Allocation Breakdown</h3>
          <div className="allocation-list">
            {data.map((item, index) => (
              <div key={index} className="allocation-item">
                <div className="allocation-header">
                  <span 
                    className="color-indicator" 
                    style={{ backgroundColor: COLORS[item.name.toLowerCase()] || '#8884d8' }}
                  ></span>
                  <span className="asset-name">{item.name}</span>
                </div>
                <div className="allocation-value">{item.value.toFixed(2)}%</div>
              </div>
            ))}
          </div>
          <div className="total-allocation">
            <strong>Total: {total.toFixed(2)}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDisplay;

