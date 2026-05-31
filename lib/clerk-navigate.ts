import type { Href, useRouter } from "expo-router";

type Router = ReturnType<typeof useRouter>;

/**
 * The `navigate` handler passed to Clerk's `signIn.finalize()` and
 * `signUp.finalize()`. Once the session is active, send the user to the home
 * route. If Clerk reports an outstanding session task, stop and let its task
 * flow take over instead of navigating.
 *
 * See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
 */
export function navigateAfterAuth(router: Router) {
  return ({ session }: { session?: { currentTask?: unknown } | null }) => {
    if (session?.currentTask) {
      return;
    }
    router.replace("/" as Href);
  };
}
