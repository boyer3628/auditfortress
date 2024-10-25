"use client";

import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden p-4 border-b flex items-center">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="ml-4">
        <Image
          src="/images/Logo.png"
          alt="Company Logo"
          width={100}
          height={27}
          priority
        />
      </div>
    </div>
  );
}
