/**
 * Units — ordered groups of lessons inside a track.
 * Hardcoded and typed (see AGENTS.md → Lesson Content Rules).
 */
import type { Unit } from "@/types/learning";

export const units: Unit[] = [
  // --- Track: Supply & Demand Foundations ---
  {
    id: "sdf-zone-basics",
    trackId: "supply-demand-foundations",
    title: "What Is a Zone?",
    subtitle: "The building blocks: bases, departures, demand and supply.",
    order: 1,
  },
  {
    id: "sdf-grading",
    trackId: "supply-demand-foundations",
    title: "Grading Zone Quality",
    subtitle: "Separate A+ zones worth trading from C zones to avoid.",
    order: 2,
  },

  // --- Track: Risk & Position Sizing ---
  {
    id: "rps-protect-capital",
    trackId: "risk-position-sizing",
    title: "Protecting Capital",
    subtitle: "The non-negotiable rules that keep you in the game.",
    order: 1,
  },
  {
    id: "rps-sizing",
    trackId: "risk-position-sizing",
    title: "Sizing the Trade",
    subtitle: "Turn a stop distance into a position size on micro futures.",
    order: 2,
  },

  // --- Track: Reading Price Action ---
  {
    id: "rpa-multi-timeframe",
    trackId: "reading-price-action",
    title: "Multi-Timeframe Workflow",
    subtitle: "Bias on the higher timeframe, entries on the lower timeframe.",
    order: 1,
  },
  {
    id: "rpa-structure-liquidity",
    trackId: "reading-price-action",
    title: "Structure & Liquidity",
    subtitle: "Read market structure and where liquidity rests to time entries.",
    order: 2,
  },
];

/** Units belonging to a track, in display order. */
export const getUnitsForTrack = (trackId: string): Unit[] =>
  units
    .filter((unit) => unit.trackId === trackId)
    .sort((a, b) => a.order - b.order);

/** Look up a single unit by id. */
export const getUnitById = (id: string): Unit | undefined =>
  units.find((unit) => unit.id === id);
