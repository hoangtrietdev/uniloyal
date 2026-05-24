import { getSupabaseClient } from './supabase';
import { LOCAL_SESSION_KEY, MOCK_ACCOUNTS } from './mockData';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
}

type AuthListener = (user: AuthUser | null) => void;

const listeners = new Set<AuthListener>();

function readStoredSession(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistSession(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (user) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
  }

  listeners.forEach((listener) => listener(user));
}

export function getStoredSessionUser() {
  return readStoredSession();
}

export function subscribeToAuthChanges(callback: AuthListener) {
  listeners.add(callback);

  if (typeof window !== 'undefined') {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_SESSION_KEY) {
        callback(readStoredSession());
      }
    };

    window.addEventListener('storage', handleStorage);
    callback(readStoredSession());

    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  callback(null);
  return () => {
    listeners.delete(callback);
  };
}

export async function signInWithCredentials(email: string, password: string): Promise<AuthUser> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('mock_accounts')
      .select('id,email,password,name,avatar,is_admin')
      .eq('email', email.trim().toLowerCase())
      .eq('password', password)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Invalid email or password.');
    }

    const user: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      isAdmin: Boolean(data.is_admin),
    };

    persistSession(user);
    return user;
  }

  const account = MOCK_ACCOUNTS.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
  if (!account) {
    throw new Error('Invalid email or password.');
  }

  const user: AuthUser = {
    id: account.id,
    email: account.email,
    name: account.name,
    avatar: account.avatar,
    isAdmin: account.isAdmin,
  };

  persistSession(user);
  return user;
}

export async function signOut(): Promise<void> {
  persistSession(null);
}

export function syncSessionUser(partialUser: Partial<AuthUser> & Pick<AuthUser, 'id'>) {
  const currentUser = readStoredSession();
  if (!currentUser || currentUser.id !== partialUser.id) {
    return;
  }

  persistSession({
    ...currentUser,
    ...partialUser,
  });
}
