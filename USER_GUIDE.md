# User Guide - Financial Planning Application

## Getting Started

When you first open the application, you'll see a profile creation form. You have two options:

### Option 1: Create a New Profile (Recommended)

Fill out the profile form with your information:

1. **Full Name**: Your name
2. **Email**: Your email address
3. **Age**: Your current age
4. **Annual Income**: Your yearly income in dollars
5. **Current Savings**: Your current savings amount
6. **Risk Profile**: Choose one:
   - **Conservative**: Lower risk, steady returns (40% stocks, 50% bonds, 10% cash)
   - **Moderate**: Balanced risk and returns (60% stocks, 30% bonds, 10% cash)
   - **Aggressive**: Higher risk, potential for higher returns (80% stocks, 15% bonds, 5% cash)

Click **"Create Profile"** to continue.

### Option 2: Test with Existing Mock Data

If you want to test with pre-loaded sample data, you can use these user IDs:

**Option A: Use Browser Console**
1. Open browser developer tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Run this command:
   ```javascript
   localStorage.setItem('userId', 1); // or 2, or 3
   window.location.reload();
   ```

**Option B: Direct API Access**
You can also test the API directly:
```bash
# Get user 1
curl http://localhost:8000/api/users/1

# Get user 1's portfolio
curl http://localhost:8000/api/portfolio/1
```

## Using the Application

### After Creating Your Profile

1. **Portfolio Configuration**
   - You'll see two modes:
     - **AI Analysis**: Enter your financial goals and time horizon, then click "Analyze & Generate Allocation"
     - **Manual Adjustment**: Manually set your portfolio percentages (must total 100%)

2. **Portfolio Display**
   - View your current allocation with an interactive pie chart
   - See breakdown by asset type (stocks, bonds, cash)

3. **Financial Plan Generation**
   - Add your financial goals (name, target amount, target date, priority)
   - Click "Generate Financial Plan" to get an AI-powered summary
   - Note: If OpenAI API key is not configured, you'll get a template plan

## Sample Mock Data Available

The application includes 3 pre-loaded users you can test with:

1. **John Doe** (ID: 1)
   - Age: 35, Income: $85,000, Savings: $45,000
   - Risk: Moderate
   - Portfolio: 60% stocks, 30% bonds, 10% cash

2. **Jane Smith** (ID: 2)
   - Age: 28, Income: $65,000, Savings: $25,000
   - Risk: Aggressive
   - Portfolio: 75% stocks, 20% bonds, 5% cash

3. **Robert Johnson** (ID: 3)
   - Age: 52, Income: $120,000, Savings: $180,000
   - Risk: Conservative
   - Portfolio: 40% stocks, 50% bonds, 10% cash

## Features

- ✅ Create and manage user profiles
- ✅ AI-powered portfolio allocation based on risk profile and goals
- ✅ Manual portfolio adjustment
- ✅ Visual portfolio display with charts
- ✅ Financial goal tracking
- ✅ AI-generated financial plan summaries (requires OpenAI API key)

## Tips

- **Time Horizon**: Longer time horizons (10+ years) will increase stock allocation
- **Risk Profile**: Choose based on your comfort with market volatility
- **Goals**: Add multiple goals with different priorities and timelines
- **Portfolio Rebalancing**: You can adjust your portfolio allocation anytime

## Troubleshooting

**Profile not saving?**
- Check browser console for errors
- Verify backend is running on port 8000
- Check network tab for API call failures

**Portfolio not showing?**
- Make sure you've created a portfolio allocation first
- Try the "AI Analysis" mode to generate one automatically

**Financial plan not generating?**
- If OpenAI API key is not set, you'll get a template plan
- Check backend logs for API errors
- Verify your goals are properly filled out

