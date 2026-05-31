/**
 * Small color helpers shared across screens.
 * Kept framework-free so any screen/component can tint a theme accent without
 * duplicating the math (see AGENTS.md → refactor when repetition appears).
 */

/** Append an alpha channel to a 6-digit hex color (e.g. "#21C16B" + 0.12). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}
