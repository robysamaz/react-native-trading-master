import { useCallback, useState } from "react";

import { useSignUp } from "@clerk/expo";
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
import { posthog } from "@/lib/posthog";
import { colors } from "@/theme/colors";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const appRouter = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  const submitting = fetchStatus === "fetching";

  // Step 1: create the sign-up with email + password, then email a code.
  const handleSignUp = useCallback(async () => {
    posthog.capture("sign_up_submitted", { method: "email" });
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      posthog.capture("sign_up_error", {
        error_type: "field",
        error_message: error.message,
      });
      return; // field/global errors are surfaced from the `errors` signal
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      posthog.capture("sign_up_error", {
        error_type: "verification_send",
        error_message: sendError.message,
      });
      return;
    }
    setVerifying(true);
  }, [signUp, email, password]);

  // Step 2: verify the emailed code, then finalize the session and go home.
  const handleVerifyCode = useCallback(
    async (code: string): Promise<string | null> => {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        posthog.capture("sign_up_error", {
          error_type: "verification_code",
          error_message: error.message,
        });
        return error.message ?? "That code didn't work. Try again.";
      }
      const { error: finalizeError } = await signUp.finalize({
        navigate: navigateAfterAuth(appRouter),
      });
      if (finalizeError) {
        posthog.capture("sign_up_error", {
          error_type: "finalize",
          error_message: finalizeError.message,
        });
        return finalizeError.message ?? "We couldn't complete your sign up.";
      }
      posthog.identify(email, {
        $set: { email },
        $set_once: { signup_date: new Date().toISOString(), signup_method: "email" },
      });
      posthog.capture("sign_up_completed", { method: "email" });
      return null;
    },
    [signUp, appRouter, email],
  );

  const handleResend = useCallback(async (): Promise<string | null> => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      return error.message ?? "We couldn't resend the code. Try again.";
    }
    return null;
  }, [signUp]);

  const emailError = errors.fields.emailAddress?.message;
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
        <Text className="text-h1 text-text-primary">Create your account</Text>
        <Text className="text-body-lg mt-2 text-text-secondary">
          Start your trading journey today ✨
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
        {emailError ? (
          <Text className="-mt-2 mb-1 font-poppins text-[12px] text-error">{emailError}</Text>
        ) : null}
        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
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
          onPress={handleSignUp}
          disabled={submitting || !email || !password}
          style={[styles.cta, (submitting || !email || !password) && styles.ctaDisabled]}
          className="mt-2 items-center justify-center rounded-2xl bg-lingua-purple py-5"
        >
          <Text className="text-h4 text-white">{submitting ? "Please wait…" : "Sign Up"}</Text>
        </TouchableOpacity>

        {/* Social */}
        <SocialAuthButtons />

        {/* Footer */}
        <View className="mt-2 flex-row justify-center">
          <Text className="font-poppins text-[14px] text-text-secondary">
            Already have an account?{" "}
          </Text>
          <Link href="/sign-in" replace>
            <Text className="font-poppins-semibold text-[14px] text-lingua-purple">Log in</Text>
          </Link>
        </View>

        {/* Clerk bot-protection mount point (invisible). */}
        <View nativeID="clerk-captcha" />
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
