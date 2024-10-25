"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";

interface Section {
  id: string;
  title: string;
  fields: string[];
}

interface ProgressIndicatorProps {
  sections: Section[];
  formData: any;
  validationSchema: any;
}

export function ProgressIndicator({ sections, formData, validationSchema }: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(sections[0]?.title || "");
  const pathname = usePathname();

  // Reset progress when pathname changes
  useEffect(() => {
    setProgress(0);
    setCurrentSection(sections[0]?.title || "");
  }, [pathname, sections]);

  // Calculate progress when form data changes
  useEffect(() => {
    const calculateProgress = () => {
      const totalFields = sections.reduce((acc, section) => acc + section.fields.length, 0);
      let completedFields = 0;

      sections.forEach(section => {
        section.fields.forEach(field => {
          const value = formData[field];
          if (value) {
            if (typeof value === 'string' && value.trim().length > 0) {
              completedFields++;
            }
            else if (typeof value === 'object' && value !== null) {
              const hasValue = Object.values(value).some(v => v !== null && v !== '');
              if (hasValue) completedFields++;
            }
            else if (value !== null) {
              completedFields++;
            }
          }
        });
      });

      setProgress(Math.round((completedFields / totalFields) * 100));

      const currentSectionIndex = sections.findIndex(section => 
        section.fields.some(field => !formData[field])
      );
      
      setCurrentSection(currentSectionIndex === -1 
        ? "Complete!" 
        : sections[currentSectionIndex].title
      );
    };

    calculateProgress();
  }, [formData, sections]);

  return (
    <div className="fixed top-16 left-0 right-0 bg-white border-b z-40">
      <div className="max-w-4xl mx-auto px-8 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground">{currentSection}</span>
          <span className="text-xs text-muted-foreground">{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  );
}
