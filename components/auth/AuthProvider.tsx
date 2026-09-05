"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  buildSessionFromProfile,
  clearSession,
  defaultSession,
  deriveRoleFromEmail,
  getDashboardHref,
  readSession,
  type MockSession,
  type UserRole,
  writeSession,
} from "@/lib/mock-auth";

interface LoginInput {
  email: string;
  password: string;
  role?: UserRole;
  remember?: boolean;
}

interface RegisterInput {
  role: UserRole;
  name: string;
  email: string;
  company: string;
  country: string;
  password?: string;
}

interface AuthValue {
  session: MockSession;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>;
  register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>;
  logout: () => void;
  updateSession: (patch: Partial<MockSession>) => void;
  isAllowed: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MockSession>(defaultSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(readSession());
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((nextSession: MockSession) => {
    setSession(nextSession);
    writeSession(nextSession);
  }, []);

  const login = useCallback(async ({ email, password, role, remember = true }: LoginInput) => {
    if (!email || !password) {
      return { ok: false, message: "Email and password are required." };
    }

    const finalRole = role ?? deriveRoleFromEmail(email);
    const nextSession = buildSessionFromProfile(finalRole, {
      name: email.includes("admin") ? "NSOMEX Admin" : finalRole === "supplier" ? "Supplier Account" : "Buyer Account",
      email,
      company: finalRole === "supplier" ? "Supplier Profile" : "Marketplace Buyer",
      country: "Nigeria",
      verificationStatus: finalRole === "supplier" ? "Verification Pending" : "Verified",
      accountStatus: "Active",
    });

    if (!remember) {
      nextSession.isAuthenticated = true;
    }

    persistSession(nextSession);
    return {
      ok: true,
      redirect: getDashboardHref(finalRole),
    };
  }, [persistSession]);

  const register = useCallback(async ({ role, name, email, company, country }: RegisterInput) => {
    if (!name || !email || !company) {
      return { ok: false, message: "Please complete all required fields." };
    }

    const nextSession = buildSessionFromProfile(role, {
      name,
      email,
      company,
      country,
      verificationStatus: role === "supplier" ? "Verification Pending" : "Verified",
      accountStatus: role === "supplier" ? "Pending Verification" : "Active",
    });

    persistSession(nextSession);
    return {
      ok: true,
      redirect: role === "supplier" ? "/onboarding/supplier" : "/onboarding/buyer",
    };
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
    setSession(defaultSession);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const updateSession = useCallback((patch: Partial<MockSession>) => {
    const nextSession = { ...session, ...patch };
    persistSession(nextSession);
  }, [persistSession, session]);

  const isAllowed = useCallback((roles: UserRole[]) => {
    return roles.includes(session.role);
  }, [session.role]);

  const value = useMemo<AuthValue>(() => ({
    session,
    isLoading,
    login,
    register,
    logout,
    updateSession,
    isAllowed,
  }), [session, isLoading, login, register, logout, updateSession, isAllowed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
