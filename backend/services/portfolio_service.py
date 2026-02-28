"""
Portfolio Service - Handles asset allocation logic
In production, this would integrate with ML models (GNN, FinBERT)
For MVP, we use rule-based allocation based on risk profile and goals
"""
from typing import Dict, List
from datetime import date, datetime
from models import User
from schemas import FinancialGoalCreate


PRIORITY_WEIGHTS = {"high": 3, "medium": 2, "low": 1}

BASE_ALLOCATIONS = {
    "conservative": {"stocks": 40, "bonds": 50, "cash": 10},
    "moderate":     {"stocks": 60, "bonds": 30, "cash": 10},
    "aggressive":   {"stocks": 80, "bonds": 15, "cash":  5},
}


class PortfolioService:
    """Service for portfolio allocation and analysis"""

    def __init__(self):
        self.ml_service = None  # Would initialize ML service here in production

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    def generate_allocation(
        self,
        user: User,
        goals: list,
        time_horizon: int = 10,
    ) -> Dict:
        """
        Derive an ideal allocation for each goal from its own time horizon
        (calculated from target_date), then blend them weighted by
        target_amount × priority.  Falls back to the single time_horizon
        value only when a goal has no parseable date.
        """
        today = date.today()
        risk_profile = user.risk_profile.lower()

        # --- per-goal allocations ----------------------------------------
        goal_breakdowns = []
        total_weight = 0.0

        for goal in goals:
            # Derive years-to-goal from target_date
            try:
                tdate = datetime.strptime(goal.target_date, "%Y-%m-%d").date()
                months = max(1, (tdate.year - today.year) * 12 + (tdate.month - today.month))
                years = max(1, round(months / 12))
            except (ValueError, AttributeError):
                years = time_horizon  # fallback

            priority_w = PRIORITY_WEIGHTS.get(goal.priority.lower(), 2)
            weight = goal.target_amount * priority_w
            alloc = self._allocation_for_horizon(risk_profile, years)

            goal_breakdowns.append({
                "goal_name": goal.goal_name,
                "time_horizon_years": years,
                "allocation": alloc,
                "weight": weight,
                "weight_pct": 0.0,
            })
            total_weight += weight

        # --- blend -----------------------------------------------------------
        if not goal_breakdowns or total_weight == 0:
            blended = self._allocation_for_horizon(risk_profile, time_horizon)
            effective_horizon = time_horizon
        else:
            blended_f = {"stocks": 0.0, "bonds": 0.0, "cash": 0.0}
            for bd in goal_breakdowns:
                bd["weight_pct"] = round(bd["weight"] / total_weight * 100, 1)
                w = bd["weight"] / total_weight
                for asset in blended_f:
                    blended_f[asset] += bd["allocation"].get(asset, 0) * w

            blended = {k: round(v) for k, v in blended_f.items()}

            # Fix integer rounding so total == 100
            diff = 100 - sum(blended.values())
            if diff != 0:
                largest = max(blended, key=blended.get)
                blended[largest] += diff

            effective_horizon = round(
                sum(bd["time_horizon_years"] * (bd["weight"] / total_weight)
                    for bd in goal_breakdowns)
            )

        # --- derived metrics --------------------------------------------------
        expected_return = (
            blended["stocks"] * 0.08 +
            blended["bonds"]  * 0.04 +
            blended["cash"]   * 0.02
        ) / 100

        risk_score = blended["stocks"] / 100

        # --- reasoning --------------------------------------------------------
        if goal_breakdowns and total_weight > 0:
            horizons = ", ".join(
                f"{bd['goal_name']} ({bd['time_horizon_years']} yrs)"
                for bd in goal_breakdowns
            )
            reasoning = (
                f"Your {len(goal_breakdowns)} goal(s) have different time horizons: {horizons}. "
                f"We derived an ideal allocation for each goal and blended them by dollar value "
                f"and priority, resulting in {blended['stocks']}% stocks, "
                f"{blended['bonds']}% bonds, and {blended['cash']}% cash "
                f"(weighted average horizon: {effective_horizon} years)."
            )
        else:
            reasoning = (
                f"Based on your {risk_profile} risk profile and {time_horizon}-year time horizon, "
                f"we recommend {blended['stocks']}% stocks, {blended['bonds']}% bonds, "
                f"and {blended['cash']}% cash."
            )

        # Strip internal 'weight' key before returning breakdowns
        clean_breakdowns = [
            {k: v for k, v in bd.items() if k != "weight"}
            for bd in goal_breakdowns
        ]

        goal_feasibility = self._compute_goal_feasibility(user, goals, expected_return)
        projection = self._compute_projection(user, goals, expected_return)

        return {
            "allocation": blended,
            "reasoning": reasoning,
            "risk_score": round(risk_score, 2),
            "expected_return": round(expected_return, 4),
            "goal_feasibility": goal_feasibility,
            "projection": projection,
            "goal_allocation_breakdown": clean_breakdowns,
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _allocation_for_horizon(self, risk_profile: str, years: int) -> Dict:
        """Return a copy of the base allocation adjusted for time horizon."""
        alloc = BASE_ALLOCATIONS.get(risk_profile, BASE_ALLOCATIONS["moderate"]).copy()

        if years > 10:
            adj = min(10, years - 10)
            alloc["stocks"] = min(90, alloc["stocks"] + adj)
            alloc["bonds"]  = max(5,  alloc["bonds"]  - adj)
        elif years < 5:
            adj = min(10, 5 - years)
            alloc["stocks"] = max(20, alloc["stocks"] - adj)
            alloc["bonds"]  = min(60, alloc["bonds"]  + adj)

        return alloc

    def _compute_goal_feasibility(
        self,
        user: User,
        goals: list,
        annual_return: float
    ) -> List[Dict]:
        """
        For each goal, compute whether the user is on track to achieve it.

        Math:
          FV of lump sum:        PV * (1 + r_m)^n
          FV of monthly savings: PMT * ((1 + r_m)^n - 1) / r_m
          Required PMT:          (target - FV_lump_sum) * r_m / ((1 + r_m)^n - 1)

        Assumptions:
          - Monthly contribution = 20% of annual income / 12
          - Compounding is monthly
        """
        results = []
        today = date.today()
        monthly_rate = annual_return / 12
        assumed_monthly = user.monthly_savings if user.monthly_savings is not None else 0.0

        for goal in goals:
            try:
                target_date = datetime.strptime(goal.target_date, "%Y-%m-%d").date()
            except (ValueError, AttributeError):
                continue

            months = max(1, (target_date.year - today.year) * 12 + (target_date.month - today.month))
            years_to_goal = round(months / 12, 1)

            # Future value of current savings (lump sum)
            fv_savings = user.current_savings * ((1 + monthly_rate) ** months)

            # Future value of monthly contributions (annuity)
            if monthly_rate > 0:
                annuity_factor = ((1 + monthly_rate) ** months - 1) / monthly_rate
                fv_contributions = assumed_monthly * annuity_factor
            else:
                annuity_factor = months
                fv_contributions = assumed_monthly * months

            projected_value = fv_savings + fv_contributions
            shortfall = goal.target_amount - projected_value
            on_track = projected_value >= goal.target_amount

            # Required monthly savings to exactly hit the goal
            remaining_needed = goal.target_amount - fv_savings
            if annuity_factor > 0:
                required_monthly = max(0.0, remaining_needed / annuity_factor)
            else:
                required_monthly = 0.0

            results.append({
                "goal_name": goal.goal_name,
                "target_amount": round(goal.target_amount, 2),
                "target_date": goal.target_date,
                "years_to_goal": years_to_goal,
                "projected_value": round(projected_value, 2),
                "shortfall": round(shortfall, 2),
                "on_track": on_track,
                "required_monthly_savings": round(required_monthly, 2),
                "assumed_monthly_contribution": round(assumed_monthly, 2),
            })

        return results

    def _compute_projection(
        self,
        user: User,
        goals: list,
        annual_return: float
    ) -> List[Dict]:
        """
        Build a year-by-year portfolio projection from today through the
        furthest goal date (minimum 10 years).

        Each point: { year: int, value: float }
        """
        today = date.today()
        monthly_rate = annual_return / 12
        assumed_monthly = user.monthly_savings if user.monthly_savings is not None else 0.0

        # Determine end year: furthest goal or at least today + 10
        end_year = today.year + 10
        for goal in goals:
            try:
                target_date = datetime.strptime(goal.target_date, "%Y-%m-%d").date()
                end_year = max(end_year, target_date.year)
            except (ValueError, AttributeError):
                pass

        projection = []
        for yr in range(today.year, end_year + 1):
            months = (yr - today.year) * 12
            if months == 0:
                value = user.current_savings
            else:
                fv_savings = user.current_savings * ((1 + monthly_rate) ** months)
                if monthly_rate > 0:
                    fv_contributions = assumed_monthly * (((1 + monthly_rate) ** months - 1) / monthly_rate)
                else:
                    fv_contributions = assumed_monthly * months
                value = fv_savings + fv_contributions
            projection.append({"year": yr, "value": round(value, 2)})

        return projection

