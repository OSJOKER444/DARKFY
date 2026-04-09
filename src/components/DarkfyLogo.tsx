import React from "react";

export function DarkfyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="darkfy-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#7B2EFF" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="darkfy-logo-grad-light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7B2EFF" />
        </linearGradient>
      </defs>
      
      {/* Base Ellipse */}
      <ellipse cx="100" cy="150" rx="60" ry="20" stroke="url(#darkfy-logo-grad)" strokeWidth="12" />
      
      {/* Right Leg */}
      <path d="M100 40 L160 150" stroke="url(#darkfy-logo-grad)" strokeWidth="12" strokeLinecap="round" />
      
      {/* Left Leg */}
      <path d="M100 40 L40 150" stroke="url(#darkfy-logo-grad)" strokeWidth="12" strokeLinecap="round" />
      
      {/* Swoosh / S-curve mimicking the image */}
      <path d="M45 130 C 90 110, 130 90, 100 40" stroke="url(#darkfy-logo-grad-light)" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M60 100 C 90 80, 110 70, 100 40" stroke="url(#darkfy-logo-grad-light)" strokeWidth="12" strokeLinecap="round" fill="none" />
    </svg>
  );
}
