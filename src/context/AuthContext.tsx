"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserRef } from "@/types/api";
import { fetchCurrentUser } from "@/services/api";

interface AuthContextProps {
  user: UserRef | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRef | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await fetchCurrentUser();
        console.log("[AuthContext] fetchCurrentUser result:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error("[AuthContext] Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
