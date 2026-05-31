import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

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

      {user?.primaryEmailAddress?.emailAddress ? (
        <Text className="text-body-md mt-3 text-center text-text-secondary">
          Signed in as {user.primaryEmailAddress.emailAddress}
        </Text>
      ) : null}

      <Link href="/onboarding" asChild>
        <TouchableOpacity
          activeOpacity={0.9}
          className="mt-8 rounded-[14px] bg-lingua-purple px-8 py-3"
        >
          <Text className="text-h4 text-white">View Onboarding</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => signOut()}
        className="mt-4 rounded-[14px] border border-border px-8 py-3"
      >
        <Text className="text-h4 text-text-primary">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
