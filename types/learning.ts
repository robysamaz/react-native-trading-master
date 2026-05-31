/**
 * Learning content domain types.
 *
 * Curriculum model (futures-trading education, not languages):
 *   Track  → the learning path the user selects (data/tracks.ts)
 *   Unit   → an ordered group of lessons inside a track (data/units.ts)
 *   Lesson → a single teachable concept (data/lessons.ts)
 *
 * All content is hardcoded and fully typed. Keep these types simple and
 * easy to extend (see AGENTS.md → Lesson Content Rules / TypeScript Rules).
 */

import type { ComponentProps } from "react";

import type { Ionicons } from "@expo/vector-icons";

/** Difficulty label shown on a track. */
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** Name of an Ionicons glyph (e.g. "stats-chart"). */
export type IconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Per-lesson progress status. Stored content ships with a sensible initial
 * status; the Zustand store owns the live progression at runtime.
 *
 * `in-progress` marks the lesson the learner is currently on (the Lessons
 * screen highlights it). No status locks a lesson out — gating is visual only.
 */
export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

/** A jargon term paired with a plain-English definition. */
export interface KeyTerm {
  term: string;
  definition: string;
}

/** A short, concrete setup/scenario walkthrough used to anchor the concept. */
export interface Example {
  title: string;
  scenario: string;
}

/**
 * A learning path the user selects (e.g. "Supply & Demand Foundations").
 * `icon` is an emoji glyph; `accent` is a hex color sourced from the theme.
 */
export interface Track {
  id: string;
  title: string;
  subtitle: string;
  /** Ionicons glyph name used as the track icon in lists/cards. */
  icon: IconName;
  difficulty: Difficulty;
  /** Accent color (hex) — keep in sync with theme/colors.ts. */
  accent: string;
}

/** An ordered group of lessons inside a track. */
export interface Unit {
  id: string;
  trackId: string;
  title: string;
  subtitle: string;
  /** 1-based position of this unit within its track. */
  order: number;
}

/** A single teachable concept inside a unit. */
export interface Lesson {
  id: string;
  trackId: string;
  unitId: string;
  /** 1-based position of this lesson within its unit. */
  order: number;
  title: string;
  /** One-sentence statement of what the learner should walk away with. */
  goal: string;
  keyTerms: KeyTerm[];
  examples: Example[];
  /** XP awarded on completion. */
  xp: number;
  /** Initial status as authored; runtime progression lives in the store. */
  status: LessonStatus;
  /** System prompt that turns the AI into a mentor for THIS lesson only. */
  aiMentorPrompt: string;
}
