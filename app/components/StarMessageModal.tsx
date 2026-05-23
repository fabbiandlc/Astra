"use client";

import { useEffect } from "react";
import { CountryFlag } from "@/app/components/CountryFlag";
import { starGlow } from "@/lib/color";

type StarMessageModalProps = {
  name: string;
  message: string;
  createdAt?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  color?: string;
  onClose: () => void;
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function StarMessageModal({
  name,
  message,
  createdAt,
  countryCode,
  countryName,
  color = "rgb(255, 255, 255)",
  onClose,
}: StarMessageModalProps) {
  const hasCountry = Boolean(countryCode);
  const formattedDate = createdAt ? formatCreatedAt(createdAt) : null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="star-message-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <div className="relative w-full max-w-md bg-black/30 border border-white/15 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 mb-5 min-w-0">
          {hasCountry ? (
            <CountryFlag
              code={countryCode}
              className="w-10 h-7 rounded-sm shrink-0 shadow-md"
            />
          ) : (
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{
                backgroundColor: color,
                boxShadow: starGlow(color),
              }}
            />
          )}

          <div className="min-w-0">
            <h2
              id="star-message-title"
              className="text-white text-xl font-light truncate"
            >
              {name}
            </h2>
            {countryName && (
              <p className="text-white/50 text-sm truncate">{countryName}</p>
            )}
            {formattedDate && (
              <p className="text-white/40 text-xs mt-0.5">{formattedDate}</p>
            )}
          </div>
        </div>

        <div className="mb-6 px-4 py-3 rounded-xl bg-white/10 border border-white/10">
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full border border-white/20 text-white py-3 rounded-xl hover:bg-white/10 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
