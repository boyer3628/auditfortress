"use client";

import React from 'react';

export function SearchBar() {
  return (
    <input 
      type="search" 
      placeholder="Search audits..." 
      className="w-full p-2 border rounded"
    />
  );
}