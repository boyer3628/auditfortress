"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";

type AuditButtonProps = {
  type: string;
  label: string;
  subtitle: string;
  href: string;
  imagePath: string;
};

export function AuditButton({ type, label, subtitle, href, imagePath }: AuditButtonProps) {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full">
        <div className="aspect-square relative mb-2 w-full">
          <Image
            src={imagePath}
            alt={`${type} audit icon`}
            fill
            style={{ objectFit: "cover" }}
            priority
            className="rounded-md"
          />
        </div>
        <h3 className="font-semibold text-lg">{label}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}