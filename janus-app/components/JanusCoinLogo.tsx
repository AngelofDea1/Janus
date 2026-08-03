"use client";

import React from "react";

export default function JanusCoinLogo({ className = "" }: { className?: string }) {
  return (
    <>
      {/* Light mode: black coin symbol */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/janus-coin-black.png"
        alt="JANUS"
        className={`dark:hidden ${className}`}
        draggable={false}
      />
      {/* Dark mode: white coin symbol */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/janus-coin-white.png"
        alt="JANUS"
        className={`hidden dark:block ${className}`}
        draggable={false}
      />
    </>
  );
}
