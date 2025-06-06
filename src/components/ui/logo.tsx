
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Círculo principal */}
      <circle cx="50" cy="50" r="45" fill="currentColor" />
      
      {/* Letra Q estilizada */}
      <path
        d="M35 40C35 32 41 26 50 26C59 26 65 32 65 40V50C65 58 59 64 50 64C45 64 41 61 38 57L42 53C44 56 47 58 50 58C55 58 59 54 59 50V40C59 36 55 32 50 32C45 32 41 36 41 40V50C41 54 45 58 50 58L50 64C41 64 35 58 35 50V40Z"
        fill="white"
      />
      
      {/* Detalhe da cauda do Q */}
      <path
        d="M55 55L65 65"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
