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
      className="group flex flex-col overflow-hidden rounded-lg border hover:border-foreground/20 transition-all hover:shadow-lg bg-white"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {!imageError ? (
          <Image
            src={`/images${imagePath}`}
            alt={label}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => {
              console.error(`Failed to load image: ${imagePath}`);
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Failed to load image
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-medium line-clamp-2">{label}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}
