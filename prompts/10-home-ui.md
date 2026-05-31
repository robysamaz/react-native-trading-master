Read AGENTS.md first and follow it strictly.

Implement the **Home screen UI**, adapting the attached design (a language-learning
home) to this app's trading domain. This app teaches futures trading, not
languages — do not carry over any language-learning labels, flags, or copy.

Home already lives at `app/(tabs)/index.tsx` (moved into the tab group in
prompt 09). **Preserve its routing gates** — wait for Clerk (`isLoaded`) and the
track store (`hasHydrated`), redirect signed-out users to `/onboarding`, and
redirect authenticated users with no `selectedTrackId` to `/track-selection`.
Only build the screen body below; do not touch the gating logic or the tab bar.

## Data sources

- **User** — read the signed-in user from Clerk (`useUser()`). Greet by
  `user.firstName` (fall back to the email's local part, then "Trader").
- **Selected track** — read via `useSelectedTrack()` from `store/track-store.ts`
  (resolves the persisted `selectedTrackId` to a full `Track`). Show the track's
  `title`, `difficulty` badge, and use its `accent` color for accents/progress.
- **Curriculum** — pull from `data/units.ts` and `data/lessons.ts`, filtered to
  the selected track's `id`. Use these to derive the sections below. Do not
  hardcode lesson copy in the screen.

## Screen content

Adapt the design's home layout to these trading-domain blocks:

- **Header** — `lingua-purple` header with the greeting and the current track
  line (e.g. "Supply & Demand Foundations · Beginner"). Keep the established
  header treatment; do not restyle the app shell.
- **Continue learning** — a prominent card for the user's current lesson: the
  first lesson whose `status` is `"available"` in track order (fall back to the
  first lesson). Show its `title`, parent unit title, `goal`, and `xp`, with a
  primary action that routes to the lesson (lesson screen is prompt 11 — link to
  its route even if it's still a placeholder).
- **Your path / progress** — list the track's `units` in `order` with a simple
  progress indicator per unit (completed vs total lessons, derived from each
  lesson's `status`). Tint progress with the track `accent`.
- **Today's plan** — a short, beginner-friendly nudge built from the current
  lesson's `keyTerms` / `examples` (e.g. "Today: learn fresh demand zones — RBR
  vs DBR"). This is educational framing only — never present it as a live trade
  signal, alert, or financial advice.

## Styling & assets

- Use NativeWind + the `global.css` / theme tokens. Use theme tokens, not raw
  hex (`lingua-purple`, `text-secondary`, etc.); pull from `theme/colors.ts`
  only where a className can't reach. Match the spacing and structure of the
  attached design cleanly.
- Use images via the centralized `images` import from `@/constants/images`
  (`tradingHero`, `mascotWelcome`, etc.) — see AGENTS.md → Image Rule. If the
  design needs an asset that isn't registered yet, add it to the assets folder
  and register it in `constants/images.ts`. Do **not** pull placeholders from
  Unsplash/Picsum — keep assets local and on-brand.

## Preserve

- Keep the existing "Clear track (dev)" helper added in prompt 08 so the
  selection flow stays re-testable.

Keep it simple, fully typed, and easy to teach. Do not introduce new libraries
beyond what is already installed.

@prompt_material/05-home-and-tab-navigation.png
