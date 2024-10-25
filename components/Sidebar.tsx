"use client";

import Link from "next/link";
import { Home, ClipboardCheck, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 transform bg-white border-r lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "w-64 lg:block"
    )}>
      <nav className="flex-1 p-4 space-y-2 pt-16">
        <Link 
          href="/"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
            pathname === "/" && "bg-gray-100"
          )}
          onClick={onClose}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Audits Section */}
        <div className="pt-4">
          <p className="px-2 mb-2">Audits</p>
          <div className="space-y-1">
            <Link
              href="/audit/fire"
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
                pathname === "/audit/fire" && "bg-gray-100"
              )}
              onClick={onClose}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Fire Extinguisher Audit</span>
            </Link>
            <Link
              href="/audit/ladder"
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
                pathname === "/audit/ladder" && "bg-gray-100"
              )}
              onClick={onClose}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Ladder Audit</span>
            </Link>
            <Link
              href="/audit/custodial"
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
                pathname === "/audit/custodial" && "bg-gray-100"
              )}
              onClick={onClose}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Custodial Audit</span>
            </Link>
            <Link
              href="/audit/landscaping"
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
                pathname === "/audit/landscaping" && "bg-gray-100"
              )}
              onClick={onClose}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Landscaping Audit</span>
            </Link>
          </div>
        </div>

        <Link 
          href="/search"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
            pathname === "/search" && "bg-gray-100"
          )}
          onClick={onClose}
        >
          <Search className="h-5 w-5" />
          <span>Search Audits</span>
        </Link>

        <Link 
          href="/settings"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100",
            pathname === "/settings" && "bg-gray-100"
          )}
          onClick={onClose}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
