import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type Provider = {
  label: string;
  icon: IoniconName;
  color: string;
};

/**
 * Social providers shown under "or continue with".
 * Brand glyphs come from Ionicons logos; colors approximate each brand
 * (a true multi-color Google "G" would need an SVG/image asset).
 */
const PROVIDERS: Provider[] = [
  { label: "Continue with Google", icon: "logo-google", color: "#EA4335" },
  { label: "Continue with Facebook", icon: "logo-facebook", color: "#1877F2" },
  { label: "Continue with Apple", icon: "logo-apple", color: "#000000" },
];

/**
 * "or continue with" divider + the three social auth buttons.
 * Mocked UI only — pressing a button is a no-op for now (real OAuth
 * arrives with Clerk in a later step).
 */
export function SocialAuthButtons() {
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
          className="mb-3 flex-row items-center justify-center rounded-2xl border border-border bg-white py-4"
        >
          <View className="absolute left-5">
            <Ionicons name={provider.icon} size={22} color={provider.color} />
          </View>
          <Text className="font-poppins-medium text-[15px] text-text-primary">
            {provider.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
