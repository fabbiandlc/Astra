"use client";

import * as FlagIcons from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";

type CountryFlagProps = {
  code: string | null | undefined;
  className?: string;
};

export function CountryFlag({
  code,
  className = "w-7 h-5 rounded-sm object-cover shadow-sm",
}: CountryFlagProps) {
  const upper = code?.trim().toUpperCase();

  if (!upper || !hasFlag(upper)) {
    return (
      <span
        className={`inline-flex items-center justify-center bg-white/10 text-white/60 text-xs rounded-sm ${className}`}
        aria-hidden
      >
        ?
      </span>
    );
  }

  const Flag = FlagIcons[upper as keyof typeof FlagIcons];

  return <Flag className={className} title={upper} aria-hidden />;
}
