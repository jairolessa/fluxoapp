import { useMemo, useSyncExternalStore } from 'react';
import { Transaction } from '../domain/finance';
import { transactionStore } from '../services/transactionStore';

export function useTransactions(): { transactions: Transaction[]; ready: boolean } {
  const state = useSyncExternalStore(transactionStore.subscribe, transactionStore.getSnapshot, transactionStore.getSnapshot);
  return { transactions: state.items, ready: state.ready };
}

export function useTransaction(id: string): { transaction: Transaction | null; ready: boolean } {
  const { transactions, ready } = useTransactions();
  const transaction = useMemo(() => transactions.find((item) => item.id === id) ?? null, [transactions, id]);
  return { transaction, ready };
}
