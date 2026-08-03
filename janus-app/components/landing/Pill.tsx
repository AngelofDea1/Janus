"use client";

import React from "react";

interface PillProps {
  children: React.ReactNode;
  className?: string;
}

export const Pill = ({ children, className = "" }: PillProps) => {
  return (
    <div
      className={`
        inline-flex items-center justify-center
        px-4 py-1.5
        bg-black/[0.03] dark:bg-white/5
        backdrop-blur-sm
        border border-borderLine
        rounded-full
        font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider
        text-slate-650 dark:text-slate-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};
