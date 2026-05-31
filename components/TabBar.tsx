import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";

// Visual constants for the bar. Kept here (not in a className) because the
// sliding circle is a Reanimated value and needs raw numbers/colors.
const CIRCLE_SIZE = 48; // diameter of the active "filled circle"
const ICON_SIZE = 24;
const PAD_TOP = 6; // space above the icon row
const LABEL_HEIGHT = 16; // reserved row under each icon (keeps icons aligned)
const BAR_HEIGHT = PAD_TOP + CIRCLE_SIZE + LABEL_HEIGHT;

// Per-route icon + label. Keyed by the route name (the file name under
// `app/(tabs)/`). Icons come from @expo/vector-icons (Ionicons) — no new lib.
const TABS: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  index: { label: "Home", icon: "home" },
  learn: { label: "Learn", icon: "book" },
  "ai-mentor": { label: "AI Mentor", icon: "sparkles" },
  chat: { label: "Chat", icon: "chatbubble" },
  profile: { label: "Profile", icon: "person" },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const tabWidth = barWidth / state.routes.length;
  // x offset that centers the circle over the active tab.
  const targetX = state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;

  const translateX = useSharedValue(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (barWidth === 0) return;
    // First measure: snap into place. After that: smooth slide.
    if (!initialized.current) {
      translateX.value = targetX;
      initialized.current = true;
    } else {
      translateX.value = withTiming(targetX, { duration: 250 });
    }
  }, [targetX, barWidth, translateX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: "row",
        height: BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        paddingTop: PAD_TOP,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      {/* Sliding active circle — sits behind the icons and animates between tabs. */}
      {barWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: PAD_TOP,
              left: 0,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              backgroundColor: colors.linguaPurple,
            },
            circleStyle,
          ]}
        />
      ) : null}

      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const tab = TABS[route.name] ?? { label: route.name, icon: "ellipse" as const };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={tab.label}
            activeOpacity={0.8}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            {/* Icon — white when active (inside the circle), secondary otherwise. */}
            <View
              style={{
                height: CIRCLE_SIZE,
                width: CIRCLE_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={tab.icon}
                size={ICON_SIZE}
                color={isActive ? colors.background : colors.textSecondary}
              />
            </View>
            {/* Label — hidden for the active tab; height stays reserved so the
                icons never shift vertically when selection changes. */}
            <View style={{ height: LABEL_HEIGHT, justifyContent: "center" }}>
              {!isActive ? (
                <Text className="text-caption" style={{ color: colors.textSecondary }}>
                  {tab.label}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
