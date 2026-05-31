/**
 * Poppins font family keys.
 * These strings must match:
 *   1. the keys registered with `useFonts` in `app/_layout.tsx`
 *   2. the `--font-*` variables in `global.css`
 *   3. the filenames loaded via the expo-font plugin in `app.json`
 */
export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export type FontFamily = (typeof fonts)[keyof typeof fonts];
