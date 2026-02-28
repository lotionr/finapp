import React, { useState } from 'react';
import './UserProfile.css';

function UserProfile({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    current_income: '',
    current_savings: '',
    monthly_savings: '',
    risk_profile: 'moderate'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      age: parseInt(formData.age),
      current_income: parseFloat(formData.current_income),
      current_savings: parseFloat(formData.current_savings),
      monthly_savings: parseFloat(formData.monthly_savings),
    });
  };

  return (
    <div className="card">
      <h2>Create Your Profile</h2>
      <p className="subtitle">Tell us about yourself to get started</p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a secure password"
            minLength="6"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="100"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="current_income">Annual Income ($)</label>
          <input
            type="number"
            id="current_income"
            name="current_income"
            value={formData.current_income}
            onChange={handleChange}
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="current_savings">Current Savings ($)</label>
          <input
            type="number"
            id="current_savings"
            name="current_savings"
            value={formData.current_savings}
            onChange={handleChange}
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="monthly_savings">Monthly Savings ($)</label>
          <input
            type="number"
            id="monthly_savings"
            name="monthly_savings"
            value={formData.monthly_savings}
            onChange={handleChange}
            min="0"
            step="100"
            placeholder="How much you save each month"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="risk_profile">Risk Profile</label>
          <select
            id="risk_profile"
            name="risk_profile"
            value={formData.risk_profile}
            onChange={handleChange}
            required
          >
            <option value="conservative">Conservative - Lower risk, steady returns</option>
            <option value="moderate">Moderate - Balanced risk and returns</option>
            <option value="aggressive">Aggressive - Higher risk, potential for higher returns</option>
          </select>
        </div>

        <button type="submit" className="button primary">
          Create Profile
        </button>
      </form>
    </div>
  );
}

export default UserProfile;

