export type DemoTransaction = {
  id: string;
  description: string;
  category: string;
  amountInCents: number;
  type: 'income' | 'expense';
  date: string;
};

// Synthetic values for the academic demo; they are not connected to a bank account.
export const mockDashboardData: {
  balanceInCents: number;
  incomeInCents: number;
  expensesInCents: number;
  transactions: DemoTransaction[];
} = {
  balanceInCents: 328450,
  incomeInCents: 520000,
  expensesInCents: 191550,
  transactions: [
    { id: 'demo-1', description: 'Salário', category: 'Renda', amountInCents: 520000, type: 'income', date: '13 out 2026' },
    { id: 'demo-2', description: 'Mercado', category: 'Alimentação', amountInCents: 125000, type: 'expense', date: '12 out 2026' },
    { id: 'demo-3', description: 'Transporte', category: 'Mobilidade', amountInCents: 32500, type: 'expense', date: '11 out 2026' },
    { id: 'demo-4', description: 'Contas da casa', category: 'Moradia', amountInCents: 34050, type: 'expense', date: '10 out 2026' },
  ],
};

const listeners = new Set<() => void>();

export function subscribeToDemoTransactions(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoTransactions(): DemoTransaction[] {
  return mockDashboardData.transactions;
}

export function getDemoTransaction(id: string): DemoTransaction | null {
  return mockDashboardData.transactions.find((transaction) => transaction.id === id) ?? null;
}

export function updateDemoTransactionCategory(id: string, category: string): boolean {
  if (!mockDashboardData.transactions.some((transaction) => transaction.id === id)) return false;
  mockDashboardData.transactions = mockDashboardData.transactions.map((transaction) =>
    transaction.id === id ? { ...transaction, category } : transaction,
  );
  listeners.forEach((listener) => listener());
  return true;
}

export function formatDemoCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(amountInCents / 100);
}
