import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NSOMEX Group | Connecting Global Business to Global Opportunity",
    template: "%s | NSOMEX Group",
  },
  description:
    "A technology-driven global business group connecting businesses, products, services, talent, and opportunities across markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
