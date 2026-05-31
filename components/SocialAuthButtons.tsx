import type { ComponentProps } from "react";
import { useState } from "react";

import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme/colors";

// Social SSO relies on Clerk's native module, which isn't bundled in Expo Go.
// In Expo Go we surface a friendly message instead of crashing the runtime.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type OAuthStrategy = "oauth_google" | "oauth_facebook" | "oauth_apple";

type Provider = {
  label: string;
  icon: IoniconName;
  color: string;
  strategy: OAuthStrategy;
};

// Required for the auth session to dismiss the in-app browser and return.
WebBrowser.maybeCompleteAuthSession();

/**
 * Social providers shown under "or continue with".
 * Brand glyphs come from Ionicons logos; colors approximate each brand.
 */
const PROVIDERS: Provider[] = [
  { label: "Continue with Google", icon: "logo-google", color: "#EA4335", strategy: "oauth_google" },
  {
    label: "Continue with Facebook",
    icon: "logo-facebook",
    color: "#1877F2",
    strategy: "oauth_facebook",
  },
  { label: "Continue with Apple", icon: "logo-apple", color: "#000000", strategy: "oauth_apple" },
];

/**
 * "or continue with" divider + the three social auth buttons.
 * Each button runs Clerk's browser-based SSO flow and, on success, activates
 * the session and sends the user to the home route.
 */
export function SocialAuthButtons() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [busy, setBusy] = useState<OAuthStrategy | null>(null);

  const handlePress = async (strategy: OAuthStrategy) => {
    if (busy) return;

    if (isExpoGo) {
      Alert.alert(
        "Development build required",
        "Social sign-in (Google, Facebook, Apple) uses native modules that aren't available in Expo Go. Email sign-up and sign-in work here — for social login, run a development build.",
      );
      return;
    }

    try {
      setBusy(strategy);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      Alert.alert(
        "Sign-in failed",
        err instanceof Error ? err.message : "Could not complete social sign-in. Please try again.",
      );
      console.error("SSO error:", JSON.stringify(err, null, 2));
    } finally {
      setBusy(null);
    }
  };

  return (
    <View>
      <View className="my-5 flex-row items-center">
        <View className="h-px flex-1 bg-border" />
        <Text className="font-poppins mx-3 text-[13px] text-text-secondary">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      {PROVIDERS.map((provider) => (
        <TouchableOpacity
          key={provider.label}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={provider.label}
          disabled={busy !== null}
          onPress={() => handlePress(provider.strategy)}
          className="mb-3 flex-row items-center justify-center rounded-2xl border border-border bg-white py-4"
          style={busy !== null ? { opacity: 0.6 } : undefined}
        >
          <View className="absolute left-5">
            {busy === provider.strategy ? (
              <ActivityIndicator size="small" color={colors.linguaPurple} />
            ) : (
              <Ionicons name={provider.icon} size={22} color={provider.color} />
            )}
          </View>
          <Text className="font-poppins-medium text-[15px] text-text-primary">
            {provider.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
