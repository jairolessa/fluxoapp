import { NewTransactionInput, Transaction } from '../domain/finance';
import { createInitialTransactions } from '../domain/seed';
import { readJson, writeJson } from './storage';

export type TransactionState = {
  userId: string | null;
  ready: boolean;
  items: Transaction[];
};

const EMPTY_STATE: TransactionState = { userId: null, ready: false, items: [] };
// New accounts start with an imported-looking history so every screen has content to show.
const SEED_NEW_ACCOUNTS = true;

const storageKey = (userId: string) => `fluxo:transactions:${userId}`;

let state: TransactionState = EMPTY_STATE;
const listeners = new Set<() => void>();

function setState(next: TransactionState) {
  state = next;
  listeners.forEach((listener) => listener());
}

async function persist() {
  if (!state.userId) return;
  await writeJson(storageKey(state.userId), state.items);
}

const byNewest = (a: Transaction, b: Transaction) => b.occurredAt - a.occurredAt;

export const transactionStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): TransactionState {
    return state;
  },

  async load(userId: string): Promise<void> {
    setState({ userId, ready: false, items: [] });
    const stored = await readJson<Transaction[]>(storageKey(userId));
    const items = stored ?? (SEED_NEW_ACCOUNTS ? createInitialTransactions(Date.now()) : []);
    if (state.userId !== userId) return; // the session changed while loading
    setState({ userId, ready: true, items });
    if (!stored) await persist();
  },

  unload(): void {
    setState(EMPTY_STATE);
  },

  async add(input: NewTransactionInput): Promise<Transaction> {
    if (!state.userId) throw new Error('Sessão encerrada.');
    const created: Transaction = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
    setState({ ...state, items: [created, ...state.items].sort(byNewest) });
    await persist();
    return created;
  },

  async updateCategory(id: string, category: string): Promise<boolean> {
    if (!state.items.some((item) => item.id === id)) return false;
    setState({ ...state, items: state.items.map((item) => (item.id === id ? { ...item, category } : item)) });
    await persist();
    return true;
  },
};
