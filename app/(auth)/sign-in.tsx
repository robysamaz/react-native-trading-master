import { useCallback, useState } from "react";

import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthField } from "@/components/AuthField";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { navigateAfterAuth } from "@/lib/clerk-navigate";
import { colors } from "@/theme/colors";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const appRouter = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Shown only when the account requires a second factor (email code).
  const [verifying, setVerifying] = useState(false);

  const submitting = fetchStatus === "fetching";

  const handleSignIn = useCallback(async () => {
    const { error } = await signIn.password({ identifier: email, password });
    if (error) {
      return; // field/global errors are surfaced from the `errors` signal
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth(appRouter) });
    } else if (signIn.status === "needs_second_factor") {
      // 2FA is enabled — email a code and collect it in the modal.
      const { error: sendError } = await signIn.mfa.sendEmailCode();
      if (sendError) {
        return; // surfaced from the `errors` signal; don't open the modal
      }
      setVerifying(true);
    }
  }, [signIn, email, password, appRouter]);

  const handleVerifyCode = useCallback(
    async (code: string): Promise<string | null> => {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        return error.message ?? "That code didn't work. Try again.";
      }
      const { error: finalizeError } = await signIn.finalize({
        navigate: navigateAfterAuth(appRouter),
      });
      if (finalizeError) {
        return finalizeError.message ?? "We couldn't complete your sign in.";
      }
      return null;
    },
    [signIn, appRouter],
  );

  const handleResend = useCallback(async (): Promise<string | null> => {
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      return error.message ?? "We couldn't resend the code. Try again.";
    }
    return null;
  }, [signIn]);

  const identifierError = errors.fields.identifier?.message;
  const passwordError = errors.fields.password?.message;
  const globalError = errors.global?.[0]?.message;

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

        {/* Fields */}
        <AuthField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        {identifierError ? (
          <Text className="-mt-2 mb-1 font-poppins text-[12px] text-error">{identifierError}</Text>
        ) : null}
        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secure
        />
        {passwordError ? (
          <Text className="-mt-2 mb-1 font-poppins text-[12px] text-error">{passwordError}</Text>
        ) : null}
        {globalError ? (
          <Text className="mb-1 font-poppins text-[12px] text-error">{globalError}</Text>
        ) : null}

        {/* Primary CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSignIn}
          disabled={submitting || !email || !password}
          style={[styles.cta, (submitting || !email || !password) && styles.ctaDisabled]}
          className="mt-2 items-center justify-center rounded-2xl bg-lingua-purple py-5"
        >
          <Text className="text-h4 text-white">{submitting ? "Please wait…" : "Sign In"}</Text>
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
        onSubmit={handleVerifyCode}
        onResend={handleResend}
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
  ctaDisabled: {
    opacity: 0.6,
  },
});
