export type UserRole = "guest" | "buyer" | "supplier" | "admin";
export type VerificationStatus =
  | "Not Verified"
  | "Verification Sent"
  | "Verified"
  | "Failed"
  | "Verification Pending"
  | "Additional Information Required";

export interface MockSession {
  isAuthenticated: boolean;
  role: UserRole;
  name: string;
  email: string;
  company: string;
  country: string;
  verificationStatus: VerificationStatus;
  accountStatus: "Active" | "Pending Verification" | "Suspended" | "Unverified";
}

export const defaultSession: MockSession = {
  isAuthenticated: false,
  role: "guest",
  name: "Guest User",
  email: "",
  company: "",
  country: "",
  verificationStatus: "Not Verified",
  accountStatus: "Active",
};

export function readSession(): MockSession {
  if (typeof window === "undefined") return defaultSession;

  try {
    const raw = window.localStorage.getItem("nsomex_mock_session");
    return raw ? { ...defaultSession, ...JSON.parse(raw) } : defaultSession;
  } catch {
    return defaultSession;
  }
}

export function writeSession(session: MockSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("nsomex_mock_session", JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("nsomex_mock_session");
}

export function getDashboardHref(role: UserRole) {
  switch (role) {
    case "buyer":
      return "/account";
    case "supplier":
      return "/supplier/dashboard";
    case "admin":
      return "/admin";
    default:
      return "/marketplace";
  }
}

export function canAccessRole(currentRole: UserRole, allowedRoles: UserRole[]) {
  return allowedRoles.includes(currentRole);
}

export function deriveRoleFromEmail(email: string): UserRole {
  const value = email.toLowerCase();
  if (value.includes("admin")) return "admin";
  if (value.includes("supplier") || value.includes("factory") || value.includes("trade")) return "supplier";
  return "buyer";
}

export function buildSessionFromProfile(
  role: UserRole,
  profile: Partial<MockSession> & { name?: string; email?: string; company?: string; country?: string },
): MockSession {
  return {
    isAuthenticated: true,
    role,
    name: profile.name ?? "NSOMEX User",
    email: profile.email ?? "",
    company: profile.company ?? "",
    country: profile.country ?? "Nigeria",
    verificationStatus: profile.verificationStatus ?? (role === "supplier" ? "Verification Pending" : "Verified"),
    accountStatus: profile.accountStatus ?? "Active",
  };
}
