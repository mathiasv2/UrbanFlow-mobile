import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as SecureStore from "../utils/storage";
import { usersApi } from "../api/users";
import { authApi } from "../api/auth";
import { User } from "../utils/types/User/user";


const TOKEN_KEY = "transport.jwt";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  bootstrapping: boolean;
  isAuthenticated: boolean;
  signIn: (input: { email: string; password: string }) => Promise<User>;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateProfile: (
    payload: Partial<Pick<User, "name" | "email">> & { password?: string }
  ) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          const profile = await usersApi.me(stored);
          setToken(stored);
          setUser(profile);
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (newToken: string, profile: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(profile);
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async ({ email, password }) => {
      const { token: jwt, user: profile } = await authApi.login({
        email,
        password,
      });
      await persistSession(jwt, profile);
      return profile;
    },
    [persistSession]
  );

  const register = useCallback<AuthContextValue["register"]>(
    async ({ name, email, password }) => {
      await authApi.register({ name, email, password });
      return signIn({ email, password });
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    try {
      if (token) await authApi.logout(token);
    } catch {
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const profile = await usersApi.me(token);
    setUser(profile);
    return profile;
  }, [token]);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    async (payload) => {
      if (!token) throw new Error("Non authentifié");
      const updated = await usersApi.updateMe(payload, token);
      setUser((prev) => ({ ...(prev as User), ...updated }));
      return updated;
    },
    [token]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      bootstrapping,
      isAuthenticated: !!token,
      signIn,
      register,
      signOut,
      refreshUser,
      updateProfile,
    }),
    [token, user, bootstrapping, signIn, register, signOut, refreshUser, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
