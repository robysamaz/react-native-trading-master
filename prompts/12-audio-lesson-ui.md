Read AGENTS.md first and follow it strictly.

Implement the **AI Mentor audio lesson screen UI**, adapting the attached design
(a language-learning AI video call) to this app's trading domain. This app
teaches futures trading, not languages — do not carry over any language-learning
labels, flags, "phrases", or copy.

This screen lives at `app/lesson/[id].tsx` (the placeholder that prior prompts
left there). Tapping a lesson on the Lessons screen (prompt 11) routes here with
the lesson `id`. Build only the screen body; do not touch the tab bar or the
routing/gating logic established in prior prompts.

This is an **audio-only** experience. Do **not** implement video calling. Keep
the camera/mentor area as a static visual preview/placeholder only. This prompt
is UI only — model session state with simple local/mock state; the real Stream
audio + Vision Agents wiring comes in prompts 13–16.

## Data sources

- **Lesson** — read the route `id` via `useLocalSearchParams`, then resolve the
  full `Lesson` with `getLessonById(id)` from `data/lessons.ts`. Render a clear
  "lesson not found" fallback if the id doesn't resolve.
- **Selected track** — read via `useSelectedTrack()` from `store/track-store.ts`
  for the `accent` color and `title` shown as the lesson's context.
- Do **not** hardcode lesson copy in the screen — read `title`, `goal`,
  `keyTerms`, `examples`, and `aiMentorPrompt` from the resolved lesson.

## Screen content

- **Header / context** — show the track `title` and the lesson `title` and
  `goal` so the learner knows exactly what this session teaches.
- **Mentor preview** — a static placeholder for the AI mentor (use a registered
  asset via the `images` import, e.g. a track/mentor image; do not embed a real
  camera feed). Overlay a **session status** indicator (e.g. "Connecting…",
  "Listening", "Mentor speaking") driven by local mock state.
- **Mentor response bubble** — a caption/transcript bubble that displays the
  mentor's current spoken line. Seed it from the lesson's `goal` /
  `aiMentorPrompt` focus so the placeholder content is on-topic; this becomes
  live transcription in prompt 17.
- **Audio controls** — a control bar with: mic toggle (mute/unmute), subtitles/
  captions toggle, and an **End session** action (not "end call") that routes
  back to the lesson list. Wire these to local UI state only for now.
- **Lesson feedback** — a lightweight post/inline feedback affordance (e.g. a
  thumbs / rating control) so the learner can react to the session. Local state
  only; persistence comes later.

## Trading-domain guardrail

The mentor teaches the lesson's concept **only**. Any placeholder/seeded mentor
copy must stay inside the lesson's `goal`, `keyTerms`, and `examples`, must never
present a live trade signal, a specific entry/exit price to act on now, or
personalized financial advice, and should reinforce risk discipline (capital
protection first, max 2% risk/trade, min 3:1 R:R). The lesson's `aiMentorPrompt`
already encodes this — do not contradict it. Stay grounded in the Samupindi
supply & demand methodology documented at the top of `data/lessons.ts`
(RBR/DBR demand, DBD/RBD supply, A+/B/C grading, HTF H4/D1 bias vs ETF M5–M15
entries, the risk rules).

## Styling & assets

- Use NativeWind + the `global.css` / theme tokens (`lingua-purple`,
  `text-secondary`, `surface`, etc.); pull from `theme/colors.ts` only where a
  className can't reach. Tint status, the active control state, and accents with
  the track `accent`. Match the spacing and structure of the attached design
  cleanly, but as an audio (not video-call) layout.
- Use images via the centralized `images` import from `@/constants/images`
  (see AGENTS.md → Image Rule). If the design needs an asset that isn't
  registered yet, add it to the assets folder and register it in
  `constants/images.ts`. Do **not** pull placeholders from Unsplash/Picsum —
  keep assets local and on-brand.

Keep it simple, fully typed, and easy to teach. Do not introduce new libraries
beyond what is already installed.

@prompt_material/07-audio-lesson-screen.png
