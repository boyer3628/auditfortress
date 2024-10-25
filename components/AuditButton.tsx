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
    <Link href={href}>
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="aspect-square relative mb-2">
          <Image
            src={imagePath}
            alt={`${type} audit icon`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <h3 className="font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}