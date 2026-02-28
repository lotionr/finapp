import React, { useState } from 'react';
import './EditProfile.css';

function EditProfile({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || '',
    current_income: user.current_income || '',
    current_savings: user.current_savings || '',
    monthly_savings: user.monthly_savings || '',
    risk_profile: user.risk_profile || 'moderate',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: formData.name,
      age: parseInt(formData.age),
      current_income: parseFloat(formData.current_income),
      current_savings: parseFloat(formData.current_savings),
      monthly_savings: parseFloat(formData.monthly_savings) || null,
      risk_profile: formData.risk_profile,
    });
    setSaving(false);
  };

  return (
    <div className="edit-profile-card">
      <h2>Edit Profile</h2>
      <p className="edit-profile-subtitle">
        Update your details — email and password are not changed here.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Row 1: Name + Age */}
        <div className="edit-profile-grid">
          <div className="input-group">
            <label htmlFor="ep-name">Full Name</label>
            <input
              type="text"
              id="ep-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="ep-age">Age</label>
            <input
              type="number"
              id="ep-age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>
        </div>

        {/* Row 2: Income + Current Savings */}
        <div className="edit-profile-grid">
          <div className="input-group">
            <label htmlFor="ep-income">Annual Income ($)</label>
            <input
              type="number"
              id="ep-income"
              name="current_income"
              value={formData.current_income}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="ep-savings">Current Savings ($)</label>
            <input
              type="number"
              id="ep-savings"
              name="current_savings"
              value={formData.current_savings}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>
        </div>

        {/* Row 3: Monthly Savings + Risk Profile */}
        <div className="edit-profile-grid">
          <div className="input-group">
            <label htmlFor="ep-monthly">Monthly Savings ($)</label>
            <input
              type="number"
              id="ep-monthly"
              name="monthly_savings"
              value={formData.monthly_savings}
              onChange={handleChange}
              min="0"
              step="100"
              placeholder="e.g. 500"
            />
          </div>
          <div className="input-group">
            <label htmlFor="ep-risk">Risk Profile</label>
            <select
              id="ep-risk"
              name="risk_profile"
              value={formData.risk_profile}
              onChange={handleChange}
              required
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div className="edit-profile-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
