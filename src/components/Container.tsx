import { cn } from "@/libs/Cn";
import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl mx-auto px-6 py-10", className)}>
      {children}
    </div>
  );
}
