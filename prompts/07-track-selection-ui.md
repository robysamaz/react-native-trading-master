Read AGENTS.md first and follow it strictly.

Implement the **track selection** screen UI, adapting the attached design (a
language picker) to this app's trading **tracks**. Use the hardcoded tracks from
`data/tracks.ts` and the existing NativeWind / global.css design utilities.

This app teaches futures trading, not languages — translate the design to our
domain:

- Header title: "Choose a track" (replace "Choose a language").
- Section heading: "Learning paths" (replace "Popular").
- Render one card per track from `data/tracks.ts`. Each card shows the track's
  `icon`, `title`, `subtitle`, and a `difficulty` badge
  (Beginner / Intermediate / Advanced) — there are no flags or "learner counts".
  Use each track's `accent` color for the selected state and badge tint.
- Selecting a card marks it as active (show the checkmark on the selected card,
  matching the design's selected row).
- The search field from the design is optional — with only a few tracks it adds
  no value, so omit it unless it stays purely cosmetic and on-brand.

Replace "See all languages" with a confirmation button (e.g. "Start learning")
that is disabled until a track is selected, and use the hero image
(`assets/images/earth.png`) at the bottom via the centralized images import.

Persist the selected track so downstream screens can read it (the home screen
already expects the selected track from Zustand + AsyncStorage).

Add a link on the home screen route (`/`) to navigate to the track selection
screen route.

@prompt_material/04-language-selection-screen.png
