import { fonts } from "./fonts";

/**
 * Lingua type scale.
 * fontSize / lineHeight (px) / weight per the design spec.
 * Mirrors the `text-*` utilities in `global.css` for TS/StyleSheet usage.
 */
export const typography = {
  h1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 38 },
  h2: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 31 },
  h3: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26 },
  h4: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 22 },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 },
  bodyMedium: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 21 },
  caption: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 15 },
} as const;

export type TypographyVariant = keyof typeof typography;
