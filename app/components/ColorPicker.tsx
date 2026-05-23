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
    <div className="mb-6">
      <p className="text-white/70 text-sm mb-2">Color de tu estrella</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
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

      <p className="mt-2 text-white/50 text-sm font-mono">{rgb}</p>
    </div>
  );
}
