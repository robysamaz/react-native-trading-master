Read AGENTS.md first and follow it strictly.

Implement the **Lessons screen UI**, adapting the attached design (a
language-learning lesson list) to this app's trading domain. This app teaches
futures trading, not languages — do not carry over any language-learning
labels, flags, "phrases", or copy.

Lessons lives in the tab group (`app/(tabs)/`, the Learn tab from prompt 09).
Build only the screen body; do not touch the tab bar or the routing/gating
logic established in prior prompts.

## Data sources

- **Selected track** — read via `useSelectedTrack()` from `store/track-store.ts`
  (resolves the persisted `selectedTrackId` to a full `Track`). Show the
  track's `title`, `difficulty` badge, and use its `accent` color for accents.
- **Curriculum** — pull from `data/units.ts` and `data/lessons.ts`, filtered to
  the selected track's `id`. Group lessons under their parent unit and render
  in `order`. Do not hardcode lesson copy in the screen — read it from the data.

## Screen content

- Render each **unit** as a section (use its `title`), with its **lessons** as
  cards beneath it in `order`.
- Each lesson card shows the lesson's `title`, `goal` (one-sentence summary),
  and `xp`, plus a status indicator derived from the lesson's `status`
  (`available` / `in-progress` / `completed` / `locked`). Tint the status and
  accents with the track `accent`.
- No locking enforcement for now — every lesson is openable regardless of
  status (the `status` field is used for the visual indicator only).
- Tapping a lesson opens the AI Mentor audio lesson screen (prompt 12), passing
  the selected lesson `id`. Link to its route even if it's still a placeholder.

## Data completeness

If the selected track has fewer than 2 lessons in `data/lessons.ts`, extend the
dataset by adding at least 5 more lessons **in `data/lessons.ts`** (not in the
screen), following the existing `Lesson` shape and `mentorPrompt(...)` helper:
`id`, `trackId`, `unitId`, `order`, `title`, `goal`, `keyTerms`, `examples`,
`xp`, `status`, `aiMentorPrompt`. New lessons must stay grounded in the
Samupindi supply & demand methodology already documented at the top of
`data/lessons.ts` — RBR/DBR demand, DBD/RBD supply, A+/B/C grading, HTF (H4/D1)
bias vs ETF (M5–M15) entries, and the risk rules (max 2% risk/trade, 3% daily
drawdown, min 3:1 R:R, stop after 2 losses, max 3 trades/session). Do **not**
author rules that contradict that methodology, and never frame lesson content
as a live trade signal or financial advice.

## Styling & assets

- Use NativeWind + the `global.css` / theme tokens (`lingua-purple`,
  `text-secondary`, etc.); pull from `theme/colors.ts` only where a className
  can't reach. Match the spacing and structure of the attached design cleanly.
- Use images via the centralized `images` import from `@/constants/images`
  (see AGENTS.md → Image Rule). For per-lesson imagery, use the relevant track
  image. If the design needs an asset that isn't registered yet, add it to the
  assets folder and register it in `constants/images.ts`. Do **not** pull
  placeholders from Unsplash/Picsum — keep assets local and on-brand.

Keep it simple, fully typed, and easy to teach. Do not introduce new libraries
beyond what is already installed.

@prompt_material/06-lesson-screen.png
