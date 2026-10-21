import { BudgetLimits } from '../domain/finance';
import { readJson, writeJson } from './storage';

export type BudgetState = {
  userId: string | null;
  ready: boolean;
  /** null until the user saves a budget for the first time. */
  limits: BudgetLimits | null;
};

const EMPTY_STATE: BudgetState = { userId: null, ready: false, limits: null };

const storageKey = (userId: string) => `fluxo:budget:${userId}`;

let state: BudgetState = EMPTY_STATE;
const listeners = new Set<() => void>();

function setState(next: BudgetState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export const budgetStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): BudgetState {
    return state;
  },

  async load(userId: string): Promise<void> {
    setState({ userId, ready: false, limits: null });
    const stored = await readJson<BudgetLimits>(storageKey(userId));
    if (state.userId !== userId) return; // the session changed while loading
    setState({ userId, ready: true, limits: stored });
  },

  unload(): void {
    setState(EMPTY_STATE);
  },

  async save(limits: BudgetLimits): Promise<void> {
    if (!state.userId) throw new Error('Sessão encerrada.');
    await writeJson(storageKey(state.userId), limits);
    setState({ ...state, limits });
  },
};
