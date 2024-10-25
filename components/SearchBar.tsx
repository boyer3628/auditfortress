"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search audits..."
        className="w-full pl-10"
      />
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}