"use client";

import { useRef } from "react";
import { hexToRgb } from "@/lib/color";

type ColorPickerProps = {
  hex: string;
  onChange: (hex: string) => void;
};

export function ColorPicker({ hex, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rgb = hexToRgb(hex);

  return (
    <div className="mb-4 sm:mb-6">
      <p className="text-white/70 text-sm mb-2">Color de tu estrella</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center sm:justify-start gap-3 flex-1 min-h-11 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition touch-manipulation text-sm sm:text-base"
        >
          <span
            className="w-8 h-8 rounded-full border border-white/30 shrink-0"
            style={{ backgroundColor: hex }}
          />
          Escoger color
        </button>

        <input
          ref={inputRef}
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-label="Selector de color"
        />
      </div>

      <p className="mt-2 text-white/50 text-xs sm:text-sm font-mono break-all">{rgb}</p>
    </div>
  );
}
