"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/lib/services/authService";
import { buildSessionFromProfile, clearSession, defaultSession, deriveRoleFromEmail, getDashboardHref, readSession, type MockSession, type UserRole, writeSession } from "@/lib/mock-auth";

interface LoginInput { email: string; password: string; role?: UserRole; remember?: boolean; }
interface RegisterInput { role: UserRole; name: string; email: string; company: string; country: string; password?: string; }
interface AuthValue { session: MockSession; isLoading: boolean; login: (input: LoginInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>; register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>; logout: () => void; updateSession: (patch: Partial<MockSession>) => void; isAllowed: (roles: UserRole[]) => boolean; }

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MockSession>(defaultSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      const localSession = readSession();
      if (!authService.isConfigured()) {
        if (active) { setSession(localSession); setIsLoading(false); }
        return;
      }
      const current = await authService.getCurrentUser();
      if (!active) return;
      if (current.user) {
        const profile = current.profile;
        setSession(buildSessionFromProfile((profile?.role ?? "buyer") as UserRole, { name: profile?.full_name ?? current.user.email ?? "NSOMEX User", email: profile?.email ?? current.user.email ?? "", company: profile?.company ?? "", country: profile?.country ?? "", verificationStatus: (profile?.verification_status as MockSession["verificationStatus"]) ?? "Not Verified", accountStatus: profile?.status === "suspended" ? "Suspended" : "Active" }));
      } else setSession(defaultSession);
      setIsLoading(false);
    }
    void loadSession();
    const subscription = authService.onAuthStateChange(() => { void loadSession(); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const persistSession = useCallback((nextSession: MockSession) => { setSession(nextSession); writeSession(nextSession); }, []);
  const login = useCallback(async ({ email, password, role, remember = true }: LoginInput) => {
    if (!email || !password) return { ok: false, message: "Email and password are required." };
    if (authService.isConfigured()) {
      const result = await authService.signIn(email, password);
      if (result.error || !result.user) return { ok: false, message: "Unable to sign in with those credentials." };
      return { ok: true, redirect: getDashboardHref(result.profile?.role ?? role ?? "buyer") };
    }
    const finalRole = role ?? deriveRoleFromEmail(email);
    const nextSession = buildSessionFromProfile(finalRole, { name: email.includes("admin") ? "NSOMEX Admin" : finalRole === "supplier" ? "Supplier Account" : "Buyer Account", email, company: finalRole === "supplier" ? "Supplier Profile" : "Marketplace Buyer", country: "Nigeria", verificationStatus: finalRole === "supplier" ? "Verification Pending" : "Verified", accountStatus: "Active" });
    if (!remember) nextSession.isAuthenticated = true;
    persistSession(nextSession);
    return { ok: true, redirect: getDashboardHref(finalRole) };
  }, [persistSession]);
  const register = useCallback(async ({ role, name, email, company, country, password }: RegisterInput) => {
    if (!name || !email || !company) return { ok: false, message: "Please complete all required fields." };
    if (role === "guest") return { ok: false, message: "Choose a buyer or supplier account." };
    if (authService.isConfigured()) {
      if (!password) return { ok: false, message: "Password is required." };
      const result = await authService.signUp({ role, name, email, company, country, password });
      if (result.error) return { ok: false, message: "Unable to create your account." };
      return { ok: true, redirect: result.emailConfirmationRequired ? "/verify-account" : role === "supplier" ? "/onboarding/supplier" : "/onboarding/buyer" };
    }
    const nextSession = buildSessionFromProfile(role, { name, email, company, country, verificationStatus: role === "supplier" ? "Verification Pending" : "Verified", accountStatus: role === "supplier" ? "Pending Verification" : "Active" });
    persistSession(nextSession);
    return { ok: true, redirect: role === "supplier" ? "/onboarding/supplier" : "/onboarding/buyer" };
  }, [persistSession]);
  const logout = useCallback(() => { clearSession(); setSession(defaultSession); if (authService.isConfigured()) void authService.signOut(); if (typeof window !== "undefined") window.location.href = "/login"; }, []);
  const updateSession = useCallback((patch: Partial<MockSession>) => persistSession({ ...session, ...patch }), [persistSession, session]);
  const isAllowed = useCallback((roles: UserRole[]) => roles.includes(session.role), [session.role]);
  const value = useMemo(() => ({ session, isLoading, login, register, logout, updateSession, isAllowed }), [session, isLoading, login, register, logout, updateSession, isAllowed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; }
