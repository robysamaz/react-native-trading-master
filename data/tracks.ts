/**
 * Tracks — the selectable top-level learning paths.
 *
 * IMPORTANT: the selectable entity is a **track** and lives here in
 * `data/tracks.ts` (NOT `languages.ts`). Import tracks from this file
 * everywhere — store, screens, and downstream features.
 *
 * Accent colors are taken from theme/colors.ts so cards stay on-brand.
 */
import { colors } from "@/theme/colors";
import type { Track } from "@/types/learning";

export const tracks: Track[] = [
  {
    id: "supply-demand-foundations",
    title: "Supply & Demand Foundations",
    subtitle: "Spot fresh institutional zones and read where price reacts.",
    icon: "stats-chart",
    difficulty: "Beginner",
    accent: colors.linguaGreen,
  },
  {
    id: "risk-position-sizing",
    title: "Risk & Position Sizing",
    subtitle: "Protect your account first — size trades to survive and stay disciplined.",
    icon: "shield-checkmark",
    difficulty: "Beginner",
    accent: colors.linguaBlue,
  },
  {
    id: "reading-price-action",
    title: "Reading Price Action",
    subtitle: "Use higher-timeframe bias to time clean entries on the lower timeframe.",
    icon: "trending-up",
    difficulty: "Intermediate",
    accent: colors.linguaPurple,
  },
];

/** Look up a single track by id. */
export const getTrackById = (id: string): Track | undefined =>
  tracks.find((track) => track.id === id);
