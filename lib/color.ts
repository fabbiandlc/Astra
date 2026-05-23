export function hexToRgb(hex: string): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return "rgb(255, 255, 255)";

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(rgb: string): string {
  const match = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return "#ffffff";

  const toHex = (n: number) =>
    Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");

  return `#${toHex(Number(match[1]))}${toHex(Number(match[2]))}${toHex(Number(match[3]))}`;
}

export function starGlow(color: string) {
  const match = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return "0 0 12px 3px rgba(255, 255, 255, 0.9)";
  return `0 0 12px 3px rgba(${match[1]}, ${match[2]}, ${match[3]}, 0.9)`;
}
