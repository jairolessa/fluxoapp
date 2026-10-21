import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authStore, User } from '../services/authStore';
import { budgetStore } from '../services/budgetStore';
import { transactionStore } from '../services/transactionStore';

type SessionValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  updatePreferredName: (preferredName: string) => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const userId = await authStore.readSession();
      const restored = userId ? await authStore.getUser(userId) : null;
      if (!active) return;
      setUser(restored);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const userId = user?.id ?? null;
  useEffect(() => {
    if (userId) {
      void transactionStore.load(userId);
      void budgetStore.load(userId);
    } else {
      transactionStore.unload();
      budgetStore.unload();
    }
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const signedIn = await authStore.login(email, password);
    await authStore.saveSession(signedIn.id);
    setUser(signedIn);
    return signedIn;
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const created = await authStore.register(fullName, email, password);
    await authStore.saveSession(created.id);
    setUser(created);
    return created;
  }, []);

  const signOut = useCallback(async () => {
    await authStore.clearSession();
    setUser(null);
  }, []);

  const updatePreferredName = useCallback(
    async (preferredName: string) => {
      if (!user) return;
      const updated = await authStore.setPreferredName(user.id, preferredName);
      if (updated) setUser(updated);
    },
    [user],
  );

  const value = useMemo<SessionValue>(
    () => ({ user, loading, signIn, register, signOut, updatePreferredName }),
    [user, loading, signIn, register, signOut, updatePreferredName],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession deve ser usado dentro de SessionProvider.');
  return value;
}
