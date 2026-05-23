import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

countries.registerLocale(es);

export type Country = {
  code: string;
  name: string;
};

export const COUNTRIES: Country[] = Object.entries(
  countries.getNames("es", { select: "official" })
)
  .map(([code, name]) => ({
    code: code.toUpperCase(),
    name: typeof name === "string" ? name : String(name),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function filterCountries(query: string, limit = 12): Country[] {
  const q = normalize(query.trim());
  if (!q) return COUNTRIES.slice(0, limit);

  return COUNTRIES.filter(
    (country) =>
      normalize(country.name).includes(q) ||
      country.code.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function findCountryByName(name: string): Country | undefined {
  const normalized = normalize(name.trim());
  return COUNTRIES.find((country) => normalize(country.name) === normalized);
}

export function findCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(
    (country) => country.code === code.trim().toUpperCase()
  );
}
