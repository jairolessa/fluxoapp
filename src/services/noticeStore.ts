export type NoticeTone = 'success' | 'error' | 'info';
export type Notice = { id: number; message: string; tone: NoticeTone };

let current: Notice | null = null;
let counter = 0;
const listeners = new Set<() => void>();

function set(next: Notice | null) {
  current = next;
  listeners.forEach((listener) => listener());
}

/** Tiny global store for transient feedback ("toast") that must survive a screen change. */
export const noticeStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: (): Notice | null => current,
  show(message: string, tone: NoticeTone = 'success'): void {
    counter += 1;
    set({ id: counter, message, tone });
  },
  dismiss(): void {
    if (current) set(null);
  },
};
