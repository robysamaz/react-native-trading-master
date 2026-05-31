import { useEffect, useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "@/theme/colors";

const CODE_LENGTH = 6;
const SLOTS = Array.from({ length: CODE_LENGTH });

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  /**
   * Verifies the entered code with Clerk. Resolve with `null` on success
   * (the caller navigates), or an error message string to show inline.
   * Fired automatically once all 6 digits are entered.
   */
  onSubmit: (code: string) => Promise<string | null>;
  /**
   * Requests a fresh code from Clerk. Resolve with `null` on success, or an
   * error message string to show inline.
   */
  onResend: () => Promise<string | null>;
};

/**
 * Bottom-sheet modal that asks the user to enter the 6-digit code Clerk
 * emailed them. A single hidden number-pad input drives six visible boxes;
 * the sheet rides above the keyboard and auto-submits on the final digit.
 */
export function VerificationModal({
  visible,
  email,
  onClose,
  onSubmit,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Reset + focus whenever the sheet opens.
  useEffect(() => {
    if (visible) {
      setCode("");
      setError(null);
      setSubmitting(false);
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Verify with Clerk once the last digit lands.
  useEffect(() => {
    if (code.length !== CODE_LENGTH || submitting) {
      return;
    }
    let cancelled = false;
    setSubmitting(true);
    inputRef.current?.blur();
    onSubmit(code)
      .then((message) => {
        if (cancelled) return;
        if (message) {
          // Verification failed — surface the error and let them retry.
          setError(message);
          setCode("");
          setSubmitting(false);
          inputRef.current?.focus();
        }
        // On success the caller navigates away; leave the sheet as-is.
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Verification failed. Try again.");
        setCode("");
        setSubmitting(false);
        inputRef.current?.focus();
      });
    return () => {
      cancelled = true;
    };
  }, [code, submitting, onSubmit]);

  const handleChange = (text: string) => {
    if (submitting) return;
    const digits = text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setError(null);
    setCode(digits);
  };

  const handleResend = async () => {
    if (submitting) return;
    setError(null);
    setCode("");
    try {
      const message = await onResend();
      if (message) {
        setError(message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't resend the code. Try again.");
    }
    inputRef.current?.focus();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        {/* Dim backdrop — tapping it dismisses the sheet. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onClose}
          style={{ position: "absolute", inset: 0, backgroundColor: "rgba(13,19,43,0.45)" }}
        />

        <View
          className="rounded-t-[28px] bg-white px-6 pb-10 pt-3"
          style={{
            shadowColor: "#0D132B",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
            elevation: 16,
          }}
        >
          {/* Grabber */}
          <View className="mb-5 self-center h-1.5 w-12 rounded-full bg-border" />

          <View className="mb-4 self-center h-14 w-14 items-center justify-center rounded-full bg-surface">
            <Ionicons name="mail-outline" size={26} color={colors.linguaPurple} />
          </View>

          <Text className="text-h3 text-center text-text-primary">Check your email</Text>
          <Text className="text-body-md mt-2 text-center text-text-secondary">
            We sent a 6-digit verification code to{"\n"}
            <Text className="font-poppins-semibold text-text-primary">
              {email || "your email"}
            </Text>
            . Enter it below to continue.
          </Text>

          {/* Tapping anywhere on the boxes focuses the hidden input. */}
          <Pressable
            className="mt-6 flex-row justify-between"
            onPress={() => inputRef.current?.focus()}
          >
            {SLOTS.map((_, index) => {
              const digit = code[index] ?? "";
              const filled = digit !== "";
              const active = index === code.length;
              return (
                <View
                  key={index}
                  className={`h-14 w-[14%] items-center justify-center rounded-2xl border ${
                    filled || active ? "border-lingua-purple bg-surface" : "border-border bg-white"
                  }`}
                >
                  <Text className="font-poppins-bold text-[22px] text-text-primary">{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          {/* Hidden field that actually captures the keystrokes. */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            editable={!submitting}
            maxLength={CODE_LENGTH}
            style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
          />

          {error ? (
            <Text className="mt-3 text-center font-poppins text-[13px] text-error">{error}</Text>
          ) : null}

          {submitting ? (
            <View className="mt-6">
              <ActivityIndicator color={colors.linguaPurple} />
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.7} onPress={handleResend} className="mt-6">
              <Text className="font-poppins-medium text-center text-[14px] text-text-secondary">
                Didn&apos;t get a code? <Text className="text-lingua-purple">Resend</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
