import { useSyncExternalStore } from 'react';
import { getDemoTransactions, subscribeToDemoTransactions } from '../services/mockDashboardData';

export function useDemoTransactions() {
  return useSyncExternalStore(subscribeToDemoTransactions, getDemoTransactions, getDemoTransactions);
}
