"use client";

import { useEffect, useState } from "react";
import { CountryFlag } from "@/app/components/CountryFlag";
import { starGlow } from "@/lib/color";

type StarMessageModalProps = {
  name: string;
  message: string;
  createdAt?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  imageUrl?: string | null;
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
  imageUrl,
  color = "rgb(255, 255, 255)",
  onClose,
}: StarMessageModalProps) {
  const [showImage, setShowImage] = useState(Boolean(imageUrl));
  const hasCountry = Boolean(countryCode);
  const formattedDate = createdAt ? formatCreatedAt(createdAt) : null;

  useEffect(() => {
    setShowImage(Boolean(imageUrl));
  }, [imageUrl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="star-message-title"
        className="relative w-full max-w-md max-h-[min(90dvh,640px)] overflow-y-auto bg-black/30 border border-white/15 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-5 min-w-0">
          {hasCountry ? (
            <CountryFlag
              code={countryCode}
              className="w-9 h-6 sm:w-10 sm:h-7 rounded-sm shrink-0 shadow-md"
            />
          ) : (
            <span
              className="w-4 h-4 rounded-full shrink-0 mt-0.5"
              style={{
                backgroundColor: color,
                boxShadow: starGlow(color),
              }}
            />
          )}

          <div className="min-w-0 flex-1">
            <h2
              id="star-message-title"
              className="text-white text-lg sm:text-xl font-light wrap-break-word"
            >
              {name}
            </h2>
            {countryName && (
              <p className="text-white/50 text-sm wrap-break-word">{countryName}</p>
            )}
            {formattedDate && (
              <p className="text-white/40 text-xs mt-0.5 wrap-break-word">
                {formattedDate}
              </p>
            )}
          </div>
        </div>

        {imageUrl && showImage ? (
          <div className="mb-4 sm:mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src={imageUrl}
              alt={`${name} image`}
              loading="lazy"
              onError={() => setShowImage(false)}
              className="w-full h-48 sm:h-56 object-contain"
            />
          </div>
        ) : null}

        <div className="mb-4 sm:mb-6 px-3 sm:px-4 py-3 rounded-xl bg-white/10 border border-white/10">
          <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-11 border border-white/20 text-white py-3 rounded-xl hover:bg-white/10 transition text-sm sm:text-base"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}