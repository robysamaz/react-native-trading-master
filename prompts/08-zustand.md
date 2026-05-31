Read AGENTS.md first and follow it strictly.

Add **track-selection state** with Zustand, persisted to
`@react-native-async-storage/async-storage`. This is the one piece of state
downstream screens (home, units, lessons) read to know which trading
curriculum to show, so it must survive app restarts.

This app teaches futures trading, not languages — the selectable top-level
entity is a **track** (a learning path like "Supply & Demand Foundations"),
defined in `data/tracks.ts` and typed by `Track` in `types/learning.ts`. Use
`data/tracks.ts` consistently; do not reintroduce `languages.ts`.

## Store (`store/track-store.ts`)

- Use Zustand with the `persist` middleware over `createJSONStorage(() =>
  AsyncStorage)`. Name the persisted key `track-store`.
- State: `selectedTrackId: string | null` (null before the user picks one) and
  a `selectTrack(id: string)` action.
- Persist **only** `selectedTrackId` via `partialize` — runtime-only flags
  should not be written to storage.
- Add a `hasHydrated` boolean plus `setHasHydrated`, set to `true` from
  `onRehydrateStorage`. Routing must wait on this so we never redirect on a
  not-yet-rehydrated `null` and flash the track-selection screen for a user who
  already has a track.
- Export a convenience hook `useSelectedTrack(): Track | undefined` that
  resolves `selectedTrackId` to the full track via `getTrackById` from
  `data/tracks.ts`.

## Routing (home route `/`)

- Wait for both Clerk (`isLoaded`) and the store (`hasHydrated`) before
  deciding where to go. Render nothing (or a splash) until both are ready.
- Signed-out users go to onboarding (existing behavior — leave it).
- An authenticated user with **no** selected track is routed to the
  track-selection screen. Only after a track is selected may they reach home
  (`/`).
- Preserve the existing home UI and theme (the `lingua-purple` header, the
  "Current track" line, and the existing links). Do not restyle it.

## Dev affordance

Add a small "Clear track (dev)" button on the home route that resets the
persisted track (clear `selectedTrackId` / AsyncStorage) so the selection flow
can be re-tested without reinstalling. Keep it clearly a development helper.

Keep it simple, fully typed, and easy to teach — no new libraries beyond
Zustand + AsyncStorage.
