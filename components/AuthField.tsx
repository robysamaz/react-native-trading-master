import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";

import { colors } from "@/theme/colors";

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  /** Renders a password input with a show/hide eye toggle. */
  secure?: boolean;
};

/**
 * Labeled input card used across the auth screens.
 * Small grey label sits above the value inside a rounded, bordered card —
 * matching the Sign Up / Sign In design.
 */
export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
  secure = false,
}: AuthFieldProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-border bg-white px-4 py-2.5">
      <View className="flex-1">
        <Text className="font-poppins text-[12px] text-text-secondary">{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure && hidden}
          style={{
            fontFamily: "Poppins-Medium",
            fontSize: 16,
            color: colors.textPrimary,
            paddingVertical: 2,
          }}
        />
      </View>

      {secure ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show password" : "Hide password"}
          hitSlop={10}
          onPress={() => setHidden((prev) => !prev)}
        >
          <Ionicons
            name={hidden ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
