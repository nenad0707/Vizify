import { useState } from "react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TemplateSelector({
  value,
  onChange,
  className,
}: TemplateSelectorProps) {
  const templates = [
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Classic" },
    { id: "minimalist", label: "Minimalist" },
  ];

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {templates.map((template) => (
        <div
          key={template.id}
          className={cn(
            "flex items-center space-x-2 rounded-md border p-2 cursor-pointer",
            value === template.id
              ? "bg-primary/10 border-primary"
              : "hover:bg-accent",
          )}
          onClick={() => onChange(template.id)}
        >
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary">
            {value === template.id && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {template.label}
          </div>
        </div>
      ))}
    </div>
  );
}
