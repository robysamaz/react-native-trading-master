import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type MarketChipData = {
  label: string;
  tone: string;
  icon: IoniconName;
  position: string;
};

/**
 * Floating market-readout chips framing the mascot.
 * Positioned as a balanced orbit (2 left / 3 right) so the composition
 * reads intentional rather than scattered.
 */
const CHIPS: MarketChipData[] = [
  { label: "Demand", tone: "#21C16B", icon: "trending-up", position: "top-2 left-0" },
  { label: "Order Flow", tone: "#6C4EF5", icon: "pulse", position: "top-[46%] -left-2" },
  { label: "Liquidity", tone: "#4D8BFF", icon: "water", position: "top-10 right-0" },
  { label: "Long", tone: "#21C16B", icon: "trending-up", position: "top-[38%] right-0" },
  { label: "Supply", tone: "#FF4D4F", icon: "trending-down", position: "bottom-6 right-2" },
];

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View className="flex-1 px-6">
        {/* Logo + wordmark */}
        <View className="mt-2 flex-row items-center justify-center">
          <Image source={images.mascotLogo} contentFit="contain" style={styles.logo} />
          <Text className="text-h3 ml-2 text-text-primary">Trading Master</Text>
        </View>

        {/* Headline */}
        <View className="mt-10">
          <Text className="text-h1 font-bold text-text-primary">
            Your AI trading{"\n"}
            <Text className="text-h1 font-bold text-lingua-purple">mentor.</Text>
          </Text>
          <Text className="text-body-lg mt-3 max-w-[290px] text-text-secondary">
            Master institutional supply & demand with personalized lessons,
            anytime, anywhere.
          </Text>
        </View>

        {/* Illustration: spotlight stage + mascot + market chips */}
        <View className="relative flex-1 items-center justify-center">
          <View className="absolute inset-0 items-center justify-center">
            <View className="h-[300px] w-[300px] rounded-full bg-surface" style={styles.spotlight} />
          </View>

          <Image source={images.mascotWelcome} contentFit="contain" style={styles.mascot} />

          {CHIPS.map((chip) => (
            <MarketChip key={chip.label} {...chip} />
          ))}
        </View>

        {/* CTA */}
        <Link href="/sign-up" asChild>
          <TouchableOpacity
            activeOpacity={0.9}
            className="mb-4 flex-row items-center justify-center rounded-[18px] bg-lingua-purple py-5"
            style={styles.cta}
          >
            <Text className="text-h4 text-white">Get Started</Text>
            <View className="absolute right-6">
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

function MarketChip({ label, tone, icon, position }: MarketChipData) {
  return (
    <View
      className={`absolute flex-row items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 ${position}`}
      style={[styles.chip, { shadowColor: tone }]}
    >
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: tone }} />
      <Text className="font-poppins-semibold text-[13px] text-text-primary">{label}</Text>
      <Ionicons name={icon} size={14} color={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  logo: { width: 34, height: 34 },
  mascot: { width: 420, height: 420 },
  spotlight: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 0,
  },
  chip: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  cta: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});
