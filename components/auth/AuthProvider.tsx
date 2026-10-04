"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/lib/services/authService";
import { config } from "@/lib/config";
import { buildSessionFromProfile, clearSession, defaultSession, deriveRoleFromEmail, getDashboardHref, readSession, type MockSession, type UserRole, writeSession } from "@/lib/mock-auth";

interface LoginInput { email: string; password: string; role?: UserRole; remember?: boolean; }
interface RegisterInput { role: UserRole; name: string; email: string; company: string; country: string; phone?: string; password?: string; }
interface AuthValue { session: MockSession; isLoading: boolean; favoriteIds: string[]; toggleFavorite: (product: { id: string; [key: string]: unknown }) => Promise<boolean>; login: (input: LoginInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>; register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string; redirect?: string }>; logout: () => Promise<void>; isAllowed: (roles: UserRole[]) => boolean; }

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MockSession>(defaultSession);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      const localSession = readSession();
      if (!authService.isConfigured()) {
        if (active) {
          if (config.isDevelopment) setSession(localSession);
          else { clearSession(); setSession(defaultSession); }
          try {
            const saved = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as { id?: string }[];
            setFavoriteIds(saved.map((item) => item.id).filter((id): id is string => Boolean(id)));
          } catch { setFavoriteIds([]); }
          setIsLoading(false);
        }
        return;
      }
      const current = await authService.getCurrentUser();
      if (!active) return;
      if (current.user && current.profile && !current.error) {
        const profile = current.profile;
        setSession(buildSessionFromProfile(profile.role as UserRole, { name: profile.full_name ?? current.user.email ?? "NSOMEX User", email: profile.email ?? current.user.email ?? "", company: profile.company ?? "", country: profile.country ?? "", verificationStatus: (profile.verification_status as MockSession["verificationStatus"]) ?? "Not Verified", accountStatus: profile.status === "suspended" ? "Suspended" : profile.status === "pending" ? "Pending Verification" : "Active" }));
        const response = await fetch("/api/favorites");
        if (response.ok && active) {
          const result = await response.json();
          setFavoriteIds((result.favorites ?? []).map((favorite: { product?: { id?: string } }) => favorite.product?.id).filter((id: unknown): id is string => typeof id === "string"));
        }
      } else { setSession(defaultSession); setFavoriteIds([]); }
      setIsLoading(false);
    }
    void loadSession();
    const subscription = authService.onAuthStateChange(() => { globalThis.setTimeout(() => { void loadSession(); }, 0); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const persistSession = useCallback((nextSession: MockSession) => { setSession(nextSession); if (config.isDevelopment && !authService.isConfigured()) writeSession(nextSession); }, []);
  const login = useCallback(async ({ email, password, role, remember = true }: LoginInput) => {
    if (!email || !password) return { ok: false, message: "Email and password are required." };
    if (authService.isConfigured()) {
      const result = await authService.signIn(email, password);
      if (result.error || !result.user) return { ok: false, message: "Unable to sign in with those credentials." };
      return { ok: true, redirect: getDashboardHref(result.profile?.role ?? role ?? "buyer") };
    }
    if (!config.isDevelopment) return { ok: false, message: "Authentication is temporarily unavailable. Please try again later." };
    const finalRole = role ?? deriveRoleFromEmail(email);
    const nextSession = buildSessionFromProfile(finalRole, { name: email.includes("admin") ? "NSOMEX Admin" : finalRole === "supplier" ? "Supplier Account" : "Buyer Account", email, company: finalRole === "supplier" ? "Supplier Profile" : "Marketplace Buyer", country: "Nigeria", verificationStatus: finalRole === "supplier" ? "Verification Pending" : "Verified", accountStatus: "Active" });
    if (!remember) nextSession.isAuthenticated = true;
    persistSession(nextSession);
    return { ok: true, redirect: getDashboardHref(finalRole) };
  }, [persistSession]);
  const register = useCallback(async ({ role, name, email, company, country, phone, password }: RegisterInput) => {
    if (!name || !email || !company) return { ok: false, message: "Please complete all required fields." };
    if (role !== "buyer" && role !== "supplier") return { ok: false, message: "Choose a buyer or supplier account." };
    if (authService.isConfigured()) {
      if (!password) return { ok: false, message: "Password is required." };
      const result = await authService.signUp({ role, name, email, company, country, phone, password });
      if (result.error) return { ok: false, message: "Unable to create your account." };
      return { ok: true, redirect: result.emailConfirmationRequired ? "/verify-account" : role === "supplier" ? "/onboarding/supplier" : "/onboarding/buyer" };
    }
    if (!config.isDevelopment) return { ok: false, message: "Registration is temporarily unavailable. Please try again later." };
    const nextSession = buildSessionFromProfile(role, { name, email, company, country, verificationStatus: role === "supplier" ? "Verification Pending" : "Verified", accountStatus: role === "supplier" ? "Pending Verification" : "Active" });
    persistSession(nextSession);
    return { ok: true, redirect: role === "supplier" ? "/onboarding/supplier" : "/onboarding/buyer" };
  }, [persistSession]);
  const logout = useCallback(async () => { if (authService.isConfigured()) await authService.signOut(); clearSession(); setSession(defaultSession); if (typeof window !== "undefined") window.location.href = "/login"; }, []);
  const toggleFavorite = useCallback(async (product: { id: string; [key: string]: unknown }) => {
    const wasSaved = favoriteIds.includes(product.id);
    if (authService.isConfigured()) {
      const response = await fetch("/api/favorites", { method: wasSaved ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
      if (!response.ok) return false;
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem("nsomex_saved") || "[]") as { id?: string }[];
        const next = wasSaved ? saved.filter((item) => item.id !== product.id) : [...saved.filter((item) => item.id !== product.id), product];
        localStorage.setItem("nsomex_saved", JSON.stringify(next));
      } catch { return false; }
    }
    setFavoriteIds((current) => wasSaved ? current.filter((id) => id !== product.id) : [...current, product.id]);
    return true;
  }, [favoriteIds]);
  const isAllowed = useCallback((roles: UserRole[]) => roles.includes(session.role), [session.role]);
  const value = useMemo(() => ({ session, isLoading, favoriteIds, toggleFavorite, login, register, logout, isAllowed }), [session, isLoading, favoriteIds, toggleFavorite, login, register, logout, isAllowed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; }
