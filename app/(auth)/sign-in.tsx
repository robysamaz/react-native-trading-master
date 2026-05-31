import { useCallback, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthField } from "@/components/AuthField";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { colors } from "@/theme/colors";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerified = useCallback(() => {
    setVerifying(false);
    router.replace("/");
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-h1 text-text-primary">Welcome back</Text>
        <Text className="text-body-lg mt-2 text-text-secondary">
          Sign in to continue your trading journey ✨
        </Text>

        {/* Mascot */}
        <View className="items-center">
          <Image source={images.mascotAuth} contentFit="contain" style={styles.mascot} />
        </View>

        {/* Field (email only — no password on sign-in) */}
        <AuthField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />

        {/* Primary CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setVerifying(true)}
          className="mt-2 items-center justify-center rounded-2xl bg-lingua-purple py-5"
          style={styles.cta}
        >
          <Text className="text-h4 text-white">Sign In</Text>
        </TouchableOpacity>

        {/* Social */}
        <SocialAuthButtons />

        {/* Footer */}
        <View className="mt-2 flex-row justify-center">
          <Text className="font-poppins text-[14px] text-text-secondary">
            Don&apos;t have an account?{" "}
          </Text>
          <Link href="/sign-up" replace>
            <Text className="font-poppins-semibold text-[14px] text-lingua-purple">Sign up</Text>
          </Link>
        </View>
      </ScrollView>

      <VerificationModal
        visible={verifying}
        email={email}
        onClose={() => setVerifying(false)}
        onComplete={handleVerified}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  mascot: { width: 200, height: 160, marginVertical: 8 },
  cta: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});
