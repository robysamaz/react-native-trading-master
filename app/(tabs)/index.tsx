import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

import { useSelectedTrack, useTrackStore } from "@/store/track-store";

// Home tab. Routing gates are preserved from the old `app/index.tsx`:
// wait for Clerk + the persisted track store, then redirect signed-out users
// to onboarding and track-less users to track selection. The tab bar only
// becomes reachable once both gates pass (a track is selected).
//
// The full Home screen UI is built in prompt 10 — this stays a minimal
// placeholder for now.
export default function HomeTab() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedTrack = useSelectedTrack();
  const hasHydrated = useTrackStore((state) => state.hasHydrated);
  const selectedTrackId = useTrackStore((state) => state.selectedTrackId);

  // Wait for BOTH Clerk and the persisted track store before routing — else we
  // could redirect on a not-yet-rehydrated `null` and flash track-selection at
  // a user who already has a track.
  if (!isLoaded || !hasHydrated) {
    return null;
  }

  // Signed-out users start at onboarding.
  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // Authenticated but no track picked yet → choose one before reaching home.
  if (!selectedTrackId) {
    return <Redirect href="/track-selection" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-h1 text-center text-lingua-purple">Home</Text>
      {selectedTrack ? (
        <Text className="text-body-md mt-3 text-center text-text-secondary">
          Current track: <Text className="text-text-primary">{selectedTrack.title}</Text>
        </Text>
      ) : null}
    </View>
  );
}
