"use client";

import Image from "next/image";
import { AuditButton } from "../components/AuditButton";
import { SearchBar } from "../components/SearchBar";

export default function Home() {
  const basePath = process.env.NODE_ENV === 'production' ? '/auditfortress' : '';
  
  return (
    <div className="p-8">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header Section with Logo */}
        <div className="flex items-center justify-between mb-8">
          <Image
            src={`${basePath}/public/images/logo.png`}
            alt="Aegis Logo"
            width={50}
            height={50}
          />
          <div className="text-center flex-grow">
            <h1 className="text-6xl font-bold">Aegis</h1>
            <p className="text-xl">
              Guarding what matters, one inspection at a time.
            </p>
          </div>
        </div>

        {/* Audit Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Which Audit would you like to perform?</h2>
          <p className="text-sm text-muted-foreground">Select an Audit to begin</p>
          
          {/* Audit Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <AuditButton 
              type="landscaping"
              label="Landscaping"
              subtitle="Inspect a Location"
              href="/audit/landscaping"
              imagePath={`${basePath}/images/landscaping-audit.png`}
            />
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Search for an audit by Auditor name or by Location name.
          </h2>
          <SearchBar />
        </div>
      </main>
    </div>
  );
}