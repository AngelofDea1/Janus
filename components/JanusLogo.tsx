"use client";

import React from "react";

export default function JanusLogo({ className = "" }: { className?: string }) {
  return (
    <>
      {/* Light mode: black logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/janus-logo-black.png"
        alt="JANUS"
        className={`dark:hidden ${className}`}
        draggable={false}
      />
      {/* Dark mode: white logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/janus-logo-white.png"
        alt="JANUS"
        className={`hidden dark:block ${className}`}
        draggable={false}
      />
    </>
  );
}
