"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CountryFlag } from "@/app/components/CountryFlag";
import { type Country, filterCountries } from "@/lib/countries";

type CountrySelectProps = {
  value: Country | null;
  onChange: (country: Country | null) => void;
};

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => filterCountries(query), [query]);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCountry(country: Country) {
    onChange(country);
    setQuery(country.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative mb-3 sm:mb-4">
      <p className="text-white/70 text-sm mb-2">País</p>

      <div className="relative">
        {value && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <CountryFlag code={value.code} className="w-7 h-5 rounded-sm" />
          </span>
        )}

        <input
          type="text"
          placeholder="Busca o escribe tu país..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && options[0]) {
              e.preventDefault();
              selectCountry(options[0]);
            }
          }}
          className={`w-full py-3 rounded-xl bg-white/10 text-white outline-none border border-transparent focus:border-white/20 ${
            value ? "pl-14 pr-4" : "px-4"
          }`}
        />
      </div>

      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full max-h-40 sm:max-h-52 overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-black/80 backdrop-blur-md shadow-xl">
          {options.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => selectCountry(country)}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-2.5 text-left text-white hover:bg-white/10 transition touch-manipulation"
              >
                <CountryFlag code={country.code} className="w-7 h-5 rounded-sm shrink-0" />
                <span className="text-sm">{country.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query && options.length === 0 && (
        <p className="mt-2 text-white/40 text-sm px-1">
          No encontramos ese país. Prueba otro nombre.
        </p>
      )}
    </div>
  );
}
