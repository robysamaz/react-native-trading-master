Read AGENTS.md first and follow it strictly.

Implement **only** the bottom tab navigation, adapting the attached design (a
language-learning home) to this app's trading domain. This app teaches futures
trading, not languages — do not carry over any language-learning labels.

Create an Expo Router `(tabs)` route group with five tabs and simple placeholder
screens for now:

- **Home** — the existing home route. Move `app/index.tsx` into the tab group as
  the Home tab (`app/(tabs)/index.tsx`) and **preserve its routing gates**: wait
  for Clerk (`isLoaded`) and the track store (`hasHydrated`), redirect
  signed-out users to `/onboarding`, and redirect authenticated users with no
  `selectedTrackId` to `/track-selection` (see prompt 08). The tab bar must only
  be reachable once a track is selected.
- **Learn** — placeholder.
- **AI Mentor** — placeholder. (The design labels this tab "AI Teacher"; use
  **"AI Mentor"** to match this app's mentor terminology — `aiMentorPrompt` in
  `data/lessons.ts`, the Stream Vision Agents mentor.)
- **Chat** — placeholder.
- **Profile** — placeholder.

Do **not** implement the Home screen UI yet — that is prompt 10. Keep Home a
minimal placeholder/pass-through for now.

## Tab bar style

Build a custom tab bar. The attached design shows a flat highlighted bar — use it
as the reference for tab order, icons, and labels, but apply our chosen active
treatment: the selected tab sits inside a filled circle showing **only the icon,
no label**, while inactive tabs show **both icon and label**. Add a smooth
animated transition for the active circle moving between tabs.

- Use `react-native-reanimated` (already installed) for the slide animation — do
  not add a new animation library.
- Use `@expo/vector-icons` (already installed) for the tab icons.
- Use the theme tokens, not raw hex: active circle = `lingua-purple` with a white
  icon; inactive icon + label = `text-secondary`. Pull colors from
  `theme/colors.ts` where a className can't reach (Reanimated values), matching
  the `global.css` `@theme` block.

Keep it simple, fully typed, and easy to teach. Do not introduce new libraries
beyond what is already installed.

@prompt_material/05-home-and-tab-navigation.png
