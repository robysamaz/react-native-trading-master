import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to hydrate the session before deciding where to go.
  if (!isLoaded) {
    return null;
  }

  // Signed-out users start at onboarding; signed-in users see home.
  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-h1 text-center text-lingua-purple">Trading Master</Text>

      <Link href="/onboarding" asChild>
        <TouchableOpacity
          activeOpacity={0.9}
          className="mt-8 rounded-[14px] bg-lingua-purple px-8 py-3"
        >
          <Text className="text-h4 text-white">View Onboarding</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
