"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { UserRef } from "@/types/api";
import { fetchCurrentUser } from "@/services/api";

interface AuthContextProps {
  user: UserRef | null;
  isLoading: boolean;
  samlLogin: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  samlLogin: false,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRef | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [samlLogin, setSamlLogin] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setSamlLogin(currentUser?.saml_login ?? false);
    } catch (error) {
      console.error("[AuthContext] Error fetching current user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, isLoading, samlLogin, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
