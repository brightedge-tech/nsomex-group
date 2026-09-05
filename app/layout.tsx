import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GlobalLayout } from "@/components/layout/global-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "NSOMEX Orbit",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
    "A modern starter experience for the NSOMEX Orbit platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <AuthProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
