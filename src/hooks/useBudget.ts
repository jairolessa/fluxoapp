import { useSyncExternalStore } from 'react';
import { BudgetLimits, DEFAULT_BUDGET_LIMITS_IN_CENTS } from '../domain/finance';
import { budgetStore } from '../services/budgetStore';

export function useBudget(): { limits: BudgetLimits; configured: boolean; ready: boolean } {
  const state = useSyncExternalStore(budgetStore.subscribe, budgetStore.getSnapshot, budgetStore.getSnapshot);
  return { limits: state.limits ?? DEFAULT_BUDGET_LIMITS_IN_CENTS, configured: state.limits !== null, ready: state.ready };
}
