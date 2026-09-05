import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GlobalLayout } from "@/components/layout/global-layout";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { config } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: config.appName,
  description: config.appDescription,
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
          <ToastProvider>
            <GlobalLayout>{children}</GlobalLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
