"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface RatingSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
}

export function RatingSlider({ value, onChange, className }: RatingSliderProps) {
  const getColor = (currentValue: number | null) => {
    if (currentValue === null) return "bg-gray-200";
    switch (currentValue) {
      case 1: return "bg-red-500 [&>.relative>.absolute]:bg-red-500";
      case 2: return "bg-orange-500 [&>.relative>.absolute]:bg-orange-500";
      case 3: return "bg-yellow-500 [&>.relative>.absolute]:bg-yellow-500";
      case 4: return "bg-[#39B54A] [&>.relative>.absolute]:bg-[#39B54A]"; // Target both track and range
      case 0: return "bg-gray-500 [&>.relative>.absolute]:bg-gray-500";
      default: return "bg-gray-200 [&>.relative>.absolute]:bg-gray-200";
    }
  };

  const getLabelText = (value: number | null) => {
    if (value === null) return "Not rated";
    switch (value) {
      case 1: return "Actions Required";
      case 2: return "Numerous issues";
      case 3: return "Minor issues";
      case 4: return "No issues";
      case 0: return "N/A";
      default: return "Not rated";
    }
  };

  return (
    <div className={cn("flex items-center gap-6 min-w-[500px]", className)}>
      <Slider
        min={0}
        max={4}
        step={1}
        value={value !== null ? [value] : [0]}
        onValueChange={(values) => onChange(values[0])}
        className={cn("w-[300px]", getColor(value))}
      />
      <span className="text-sm w-[150px]">
        {getLabelText(value)}
      </span>
    </div>
  );
}
