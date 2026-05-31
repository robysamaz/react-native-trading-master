Read AGENTS.md first and follow it strictly.

Create the learning content system using hardcoded TypeScript data. Add
`types/learning.ts`, `data/tracks.ts`, `data/units.ts`, and `data/lessons.ts`.

NOTE: the selectable top-level entity is a **track**, stored in `data/tracks.ts`
(NOT `languages.ts`). Use `data/tracks.ts` consistently everywhere — store,
screens, and all downstream prompts import from `data/tracks.ts`.

This app teaches futures trading, not languages. Model the curriculum as:

- **Track** (`data/tracks.ts`): a learning path the user selects — e.g.
  "Supply & Demand Foundations", "Risk & Position Sizing", "Reading Price
  Action". Each track has id, title, subtitle, icon/image, difficulty
  (Beginner | Intermediate | Advanced), and an accent color.
- **Unit / Module** (`data/units.ts`): an ordered group of lessons inside a track.
- **Lesson** (`data/lessons.ts`): id, trackId, unitId, title, goal (one
  sentence), `keyTerms` (term + plain-English definition), `examples` (short
  setup/scenario walkthroughs), an XP value, a status field, and an
  `aiMentorPrompt` for the voice lesson.

Seed a small, beginner-friendly sample dataset grounded in this trading
methodology (do not invent contradictory rules):

- Supply & Demand zones: RBR, DBR (demand) and DBD, RBD (supply)
- Zone quality grading: A+ / B / C (freshness, departure strength, structure
  break, HTF alignment)
- Multi-timeframe: HTF (H4/D1) for bias, ETF (M5–M15) for entries
- Risk rules: max 2% risk/trade, 3% daily drawdown, min 3:1 R:R, stop after
  2 losses, max 3 trades/session
- Instruments: MES, MNQ, MYM, MCL, MGC (Micro Gold), M6E (Micro EUR/USD)

The `aiMentorPrompt` should make the AI act as a calm, disciplined trading
mentor for that lesson only — teaching the concept, staying strictly within
the lesson's goal, keyTerms, and examples, never giving live trade signals or
financial advice, and reinforcing risk discipline.

Keep it simple, fully typed, and easy to extend.
