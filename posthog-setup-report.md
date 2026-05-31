<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into TradingMaster. The following changes were made:

- **`app.config.js`** — Created (replaces `app.json` as the active Expo config) to expose PostHog credentials via `expo-constants` extras. `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are read from `.env` at build time.
- **`lib/posthog.ts`** — New PostHog client singleton configured via `Constants.expoConfig?.extra`. Handles disabled-mode gracefully when the token is not set.
- **`app/_layout.tsx`** — `PostHogProvider` wraps the app (inside `ClerkProvider`). A `ScreenTracker` component fires `posthog.screen()` on every route change for automatic screen analytics, with autocapture enabled for touch events.
- **`app/onboarding.tsx`** — Captures `onboarding_get_started` when the CTA is pressed.
- **`app/(auth)/sign-up.tsx`** — Captures `sign_up_submitted`, `sign_up_error`, `sign_up_completed`; calls `posthog.identify()` with email on successful registration.
- **`app/(auth)/sign-in.tsx`** — Captures `sign_in_submitted`, `sign_in_error`, `sign_in_completed`; calls `posthog.identify()` with email on successful login (including MFA path).
- **`components/SocialAuthButtons.tsx`** — Captures `social_auth_started`, `social_auth_completed`, and `social_auth_error` with a `provider` property for each OAuth strategy.
- **`app/track-selection.tsx`** — Captures `track_selected` (with `track_id`, `track_title`) and `track_learning_started` (with `track_id`) when a user confirms their learning path.
- **`app/(tabs)/index.tsx`** — Captures `lesson_opened` (with `lesson_id`, `lesson_title`, `track_id`) when the user taps Continue to open a lesson.

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_get_started` | User taps Get Started on the onboarding welcome screen — top of the acquisition funnel | `app/onboarding.tsx` |
| `sign_up_submitted` | User submits the sign-up form with email and password | `app/(auth)/sign-up.tsx` |
| `sign_up_completed` | User successfully verifies their email code and the sign-up session is finalized | `app/(auth)/sign-up.tsx` |
| `sign_up_error` | Sign-up attempt fails — captures error type for funnel drop-off analysis | `app/(auth)/sign-up.tsx` |
| `sign_in_submitted` | User submits the sign-in form with email and password | `app/(auth)/sign-in.tsx` |
| `sign_in_completed` | User successfully signs in and the session is finalized | `app/(auth)/sign-in.tsx` |
| `sign_in_error` | Sign-in attempt fails — captures error type for retention/auth debugging | `app/(auth)/sign-in.tsx` |
| `social_auth_started` | User taps a social auth button (Google, Facebook, Apple) — includes `provider` property | `components/SocialAuthButtons.tsx` |
| `social_auth_completed` | Social SSO flow completes and session is activated — includes `provider` property | `components/SocialAuthButtons.tsx` |
| `social_auth_error` | Social SSO flow fails — includes `provider` and `error_message` | `components/SocialAuthButtons.tsx` |
| `track_selected` | User taps a track card on the track selection screen — includes `track_id`, `track_title` | `app/track-selection.tsx` |
| `track_learning_started` | User confirms their track selection and navigates to home — includes `track_id` | `app/track-selection.tsx` |
| `lesson_opened` | User taps Continue from the home screen to open a lesson — includes `lesson_id`, `lesson_title`, `track_id` | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1650798)
- [Acquisition funnel](/insights/kBpwdyT7) — Onboarding → Sign-up submitted → Sign-up completed
- [Daily new sign-ups](/insights/vpp0NTIA) — Unique users completing sign-up per day
- [Track popularity](/insights/npwXlixD) — track_selected broken down by track ID
- [Lesson engagement](/insights/hieGeu2f) — lesson_opened count over time
- [Auth error rate](/insights/fS1NIE13) — Sign-up and sign-in errors over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
