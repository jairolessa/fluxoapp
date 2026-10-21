import * as Crypto from 'expo-crypto';
import { readJson, removeKey, writeJson } from './storage';

export type User = {
  id: string;
  fullName: string;
  email: string;
  preferredName?: string;
};

type StoredUser = User & { salt: string; passwordHash: string };

const USERS_KEY = 'fluxo:users';
const SESSION_KEY = 'fluxo:session';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function hashPassword(salt: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

async function loadUsers(): Promise<StoredUser[]> {
  return (await readJson<StoredUser[]>(USERS_KEY)) ?? [];
}

const toUser = ({ id, fullName, email, preferredName }: StoredUser): User => ({ id, fullName, email, preferredName });

export const authStore = {
  async register(fullName: string, email: string, password: string): Promise<User> {
    const users = await loadUsers();
    const normalizedEmail = normalizeEmail(email);
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    const salt = Crypto.randomUUID();
    const created: StoredUser = {
      id: Crypto.randomUUID(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      salt,
      passwordHash: await hashPassword(salt, password),
    };
    await writeJson(USERS_KEY, [...users, created]);
    return toUser(created);
  },

  async login(email: string, password: string): Promise<User> {
    const users = await loadUsers();
    const user = users.find((candidate) => candidate.email === normalizeEmail(email));
    const hash = user ? await hashPassword(user.salt, password) : null;
    if (!user || hash !== user.passwordHash) {
      throw new Error('E-mail ou senha inválidos.');
    }
    return toUser(user);
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const users = await loadUsers();
    const index = users.findIndex((candidate) => candidate.email === normalizeEmail(email));
    if (index < 0) throw new Error('Não encontramos uma conta com este e-mail neste aparelho.');
    const salt = Crypto.randomUUID();
    const updated = [...users];
    updated[index] = { ...users[index], salt, passwordHash: await hashPassword(salt, newPassword) };
    await writeJson(USERS_KEY, updated);
  },

  async setPreferredName(userId: string, preferredName: string): Promise<User | null> {
    const users = await loadUsers();
    const index = users.findIndex((candidate) => candidate.id === userId);
    if (index < 0) return null;
    const updated = [...users];
    updated[index] = { ...users[index], preferredName };
    await writeJson(USERS_KEY, updated);
    return toUser(updated[index]);
  },

  async getUser(userId: string): Promise<User | null> {
    const user = (await loadUsers()).find((candidate) => candidate.id === userId);
    return user ? toUser(user) : null;
  },

  async saveSession(userId: string): Promise<void> {
    await writeJson(SESSION_KEY, userId);
  },

  async readSession(): Promise<string | null> {
    return readJson<string>(SESSION_KEY);
  },

  async clearSession(): Promise<void> {
    await removeKey(SESSION_KEY);
  },
};
