"use client";

import Image from "next/image";
import { AuditButton } from "../components/AuditButton";

export default function Home() {
  const basePath = process.env.NODE_ENV === 'production' ? '/auditfortress' : '';
  
  return (
    <div className="p-8">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">Aegis</h1>
          <p className="text-xl">
            Guarding what matters, one inspection at a time.
          </p>
        </div>

        {/* Audit Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Which Audit would you like to perform?</h2>
          <p className="text-sm text-muted-foreground">Select an Audit to begin</p>
          
          {/* Audit Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AuditButton 
              type="fire"
              label="Fire Extinguisher"
              subtitle="Inspect a Fire Extinguisher"
              href="/audit/fire"
              imagePath={`${basePath}/images/fire-audit.png`}
            />
            <AuditButton 
              type="ladder"
              label="Ladder"
              subtitle="Inspect a Ladder"
              href="/audit/ladder"
              imagePath={`${basePath}/images/ladder-audit.png`}
            />
            <AuditButton 
              type="custodial"
              label="Custodial"
              subtitle="Inspect a Location"
              href="/audit/custodial"
              imagePath={`${basePath}/images/custodial-audit.png`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
