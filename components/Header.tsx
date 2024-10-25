"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're on an audit page
  const isAuditPage = pathname.includes('/audit/');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-50">
      <div className="h-full flex items-center px-4">
        {isAuditPage && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Logo.png"
            alt="Company Logo"
            width={150}
            height={40}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Only render sidebar on audit pages */}
      {isAuditPage && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
    </header>
  );
}
