export type TransactionType = 'income' | 'expense';

export type TransactionLocation = {
  latitude: number;
  longitude: number;
  label?: string;
};

export type Transaction = {
  id: string;
  description: string;
  category: string;
  amountInCents: number;
  type: TransactionType;
  occurredAt: number;
  receiptUri?: string;
  location?: TransactionLocation;
};

export type NewTransactionInput = Omit<Transaction, 'id'>;

export const EXPENSE_CATEGORIES = ['Alimentação', 'Moradia', 'Mobilidade', 'Saúde', 'Lazer', 'Outros'] as const;
export const INCOME_CATEGORIES = ['Salário', 'Renda extra', 'Investimentos', 'Outros'] as const;

export function categoriesFor(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export type BudgetLimits = Readonly<Record<string, number>>;

export const DEFAULT_BUDGET_LIMITS_IN_CENTS: BudgetLimits = {
  Alimentação: 150000,
  Moradia: 180000,
  Mobilidade: 40000,
  Saúde: 30000,
  Lazer: 25000,
  Outros: 20000,
};

const WARNING_THRESHOLD = 0.8;

export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export function budgetStatus(spentInCents: number, limitInCents: number): BudgetStatus {
  if (limitInCents <= 0) return 'ok';
  const ratio = spentInCents / limitInCents;
  if (ratio > 1) return 'exceeded';
  if (ratio >= WARNING_THRESHOLD) return 'warning';
  return 'ok';
}

export const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  ok: 'Dentro do limite',
  warning: 'Perto do limite',
  exceeded: 'Limite excedido',
};

export function isSameMonth(timestamp: number, reference: number): boolean {
  const a = new Date(timestamp);
  const b = new Date(reference);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export type Summary = {
  balanceInCents: number;
  monthIncomeInCents: number;
  monthExpensesInCents: number;
};

export function summarize(transactions: readonly Transaction[], now: number): Summary {
  let balanceInCents = 0;
  let monthIncomeInCents = 0;
  let monthExpensesInCents = 0;
  for (const transaction of transactions) {
    const signed = transaction.type === 'income' ? transaction.amountInCents : -transaction.amountInCents;
    balanceInCents += signed;
    if (!isSameMonth(transaction.occurredAt, now)) continue;
    if (transaction.type === 'income') monthIncomeInCents += transaction.amountInCents;
    else monthExpensesInCents += transaction.amountInCents;
  }
  return { balanceInCents, monthIncomeInCents, monthExpensesInCents };
}

export type CategorySpending = {
  category: string;
  spentInCents: number;
  limitInCents: number;
  status: BudgetStatus;
};

export function spendingByCategory(
  transactions: readonly Transaction[],
  now: number,
  limits: BudgetLimits = DEFAULT_BUDGET_LIMITS_IN_CENTS,
): CategorySpending[] {
  const spent = new Map<string, number>();
  for (const transaction of transactions) {
    if (transaction.type !== 'expense' || !isSameMonth(transaction.occurredAt, now)) continue;
    spent.set(transaction.category, (spent.get(transaction.category) ?? 0) + transaction.amountInCents);
  }
  const categories = new Set<string>([...EXPENSE_CATEGORIES, ...spent.keys()]);
  return [...categories]
    .map((category) => {
      const spentInCents = spent.get(category) ?? 0;
      const limitInCents = limits[category] ?? limits.Outros ?? DEFAULT_BUDGET_LIMITS_IN_CENTS.Outros;
      return { category, spentInCents, limitInCents, status: budgetStatus(spentInCents, limitInCents) };
    })
    .sort((a, b) => b.spentInCents - a.spentInCents);
}

export function buildInsight(spending: readonly CategorySpending[]): string {
  const critical = spending
    .filter((item) => item.status !== 'ok')
    .sort((a, b) => b.spentInCents / b.limitInCents - a.spentInCents / a.limitInCents)[0];
  if (!critical) return 'Seus gastos estão dentro do orçamento neste mês.';
  const percent = Math.round((critical.spentInCents / critical.limitInCents) * 100);
  return critical.status === 'exceeded'
    ? `Você ultrapassou o orçamento de ${critical.category} neste mês (${percent}% do limite).`
    : `Você já usou ${percent}% do orçamento de ${critical.category} neste mês.`;
}

export function parseAmountToCents(digits: string): number {
  const onlyDigits = digits.replace(/\D/g, '').slice(0, 9);
  return onlyDigits ? Number(onlyDigits) : 0;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatCurrency(amountInCents: number): string {
  return currencyFormatter.format(amountInCents / 100);
}

export function formatSignedCurrency(transaction: Pick<Transaction, 'type' | 'amountInCents'>): string {
  return `${transaction.type === 'income' ? '+' : '−'}${formatCurrency(transaction.amountInCents)}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatMonthYear(timestamp: number): string {
  const text = new Date(timestamp).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return text.charAt(0).toUpperCase() + text.slice(1);
}
