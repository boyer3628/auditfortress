"use client";

import { Header } from "@/components/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16"> {/* Add padding to account for fixed header */}
        {children}
      </main>
    </div>
  );
}
