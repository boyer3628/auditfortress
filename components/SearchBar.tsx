"use client";

import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <Input 
      type="search"
      placeholder="Auditor or Location"
      className="max-w-full"
    />
  );
}
