"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface AuditButtonProps {
  type: string;
  label: string;
  subtitle: string;
  href: string;
  imagePath: string;
}

export function AuditButton({ label, subtitle, href, imagePath }: AuditButtonProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md bg-white"
    >
      <div className="relative h-40 w-full bg-gray-50">
        {!imageError ? (
          <Image
            src={imagePath}
            alt={label}
            fill
            className="object-cover p-2"
            onError={() => {
              console.error(`Failed to load image: ${imagePath}`);
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Image not found
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}
