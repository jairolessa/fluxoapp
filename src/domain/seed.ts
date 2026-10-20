import { Transaction, TransactionType } from './finance';

type SeedTemplate = {
  monthsAgo: number;
  day: number;
  description: string;
  category: string;
  amountInCents: number;
  type: TransactionType;
};

const MONTHS_OF_HISTORY = 3;

const recurring: Omit<SeedTemplate, 'monthsAgo'>[] = [
  { day: 5, description: 'Salário', category: 'Salário', amountInCents: 520000, type: 'income' },
  { day: 8, description: 'Aluguel', category: 'Moradia', amountInCents: 120000, type: 'expense' },
  { day: 9, description: 'Condomínio', category: 'Moradia', amountInCents: 34050, type: 'expense' },
  { day: 12, description: 'Conta de energia', category: 'Moradia', amountInCents: 18730, type: 'expense' },
  { day: 15, description: 'Internet', category: 'Moradia', amountInCents: 9990, type: 'expense' },
  { day: 3, description: 'Supermercado', category: 'Alimentação', amountInCents: 38400, type: 'expense' },
  { day: 10, description: 'Supermercado', category: 'Alimentação', amountInCents: 41250, type: 'expense' },
  { day: 17, description: 'Supermercado', category: 'Alimentação', amountInCents: 36780, type: 'expense' },
  { day: 24, description: 'Restaurante', category: 'Alimentação', amountInCents: 8900, type: 'expense' },
  { day: 6, description: 'Combustível', category: 'Mobilidade', amountInCents: 15000, type: 'expense' },
  { day: 18, description: 'Aplicativo de transporte', category: 'Mobilidade', amountInCents: 3250, type: 'expense' },
  { day: 11, description: 'Farmácia', category: 'Saúde', amountInCents: 7420, type: 'expense' },
  { day: 20, description: 'Streaming', category: 'Lazer', amountInCents: 3990, type: 'expense' },
  { day: 22, description: 'Cinema', category: 'Lazer', amountInCents: 6400, type: 'expense' },
];

const extras: SeedTemplate[] = [
  { monthsAgo: 1, day: 18, description: 'Projeto freelance', category: 'Renda extra', amountInCents: 85000, type: 'income' },
  { monthsAgo: 0, day: 14, description: 'Rendimento de investimentos', category: 'Investimentos', amountInCents: 12680, type: 'income' },
  { monthsAgo: 2, day: 27, description: 'Consulta médica', category: 'Saúde', amountInCents: 25000, type: 'expense' },
];

function atNoon(monthsAgo: number, day: number, now: Date): number {
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, day, 12, 0, 0).getTime();
}

/** Initial history for a new account, relative to the current date and sorted newest first. */
export function createInitialTransactions(nowMs: number): Transaction[] {
  const now = new Date(nowMs);
  const templates: SeedTemplate[] = [...extras];
  for (let monthsAgo = 0; monthsAgo < MONTHS_OF_HISTORY; monthsAgo += 1) {
    for (const item of recurring) templates.push({ ...item, monthsAgo });
  }
  return templates
    .map((template) => ({ template, occurredAt: atNoon(template.monthsAgo, template.day, now) }))
    .filter(({ occurredAt }) => occurredAt <= nowMs)
    .sort((a, b) => b.occurredAt - a.occurredAt)
    .map(({ template, occurredAt }, index) => ({
      id: `initial-${index + 1}`,
      description: template.description,
      category: template.category,
      amountInCents: template.amountInCents,
      type: template.type,
      occurredAt,
    }));
}
