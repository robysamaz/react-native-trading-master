import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { tracks } from "@/data/tracks";
import { withAlpha } from "@/lib/color";
import { posthog } from "@/lib/posthog";
import { useTrackStore } from "@/store/track-store";
import { colors } from "@/theme/colors";
import type { Track } from "@/types/learning";

export default function TrackSelection() {
  const selectedTrackId = useTrackStore((state) => state.selectedTrackId);
  const selectTrack = useTrackStore((state) => state.selectTrack);

  const handleSelectTrack = (trackId: string, trackTitle: string) => {
    selectTrack(trackId);
    posthog.capture("track_selected", { track_id: trackId, track_title: trackTitle });
  };

  const handleStart = () => {
    if (!selectedTrackId) return;
    const track = tracks.find((t) => t.id === selectedTrackId);
    posthog.capture("track_learning_started", {
      track_id: selectedTrackId,
      track_title: track?.title ?? null,
    });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-6 pb-2 pt-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={12}
          className="absolute left-6 z-10"
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="text-h3 flex-1 text-center text-text-primary">Choose a track</Text>
      </View>

      {/* Section heading */}
      <Text className="text-body-sm mt-4 px-6 font-poppins-semibold text-text-secondary">
        Learning paths
      </Text>

      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            selected={track.id === selectedTrackId}
            onPress={() => handleSelectTrack(track.id, track.title)}
          />
        ))}
      </ScrollView>

      {/* Confirmation CTA */}
      <View className="px-6">
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={!selectedTrackId}
          onPress={handleStart}
          className={`flex-row items-center justify-center rounded-[18px] py-5 ${
            selectedTrackId ? "bg-lingua-purple" : "bg-surface"
          }`}
          style={selectedTrackId ? styles.ctaEnabled : undefined}
        >
          <Text
            className={`text-h4 ${selectedTrackId ? "text-white" : "text-text-secondary"}`}
          >
            Start learning
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero illustration */}
      <Image source={images.tradingHero} contentFit="contain" style={styles.hero} />
    </SafeAreaView>
  );
}

function TrackCard({
  track,
  selected,
  onPress,
}: {
  track: Track;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border p-4"
      style={{
        borderColor: selected ? track.accent : colors.border,
        backgroundColor: selected ? withAlpha(track.accent, 0.08) : colors.background,
      }}
    >
      {/* Icon tile */}
      <View
        className="h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: selected ? withAlpha(track.accent, 0.16) : colors.surface }}
      >
        <Ionicons name={track.icon} size={24} color={track.accent} />
      </View>

      {/* Title + subtitle + difficulty */}
      <View className="ml-3 flex-1">
        <Text className="text-h4 text-text-primary">{track.title}</Text>
        <Text className="text-body-sm mt-0.5 text-text-secondary" numberOfLines={2}>
          {track.subtitle}
        </Text>
        <View
          className="badge mt-2"
          style={{ backgroundColor: withAlpha(track.accent, 0.14) }}
        >
          <Text className="badge__text" style={{ color: track.accent }}>
            {track.difficulty}
          </Text>
        </View>
      </View>

      {/* Trailing affordance: check when selected, chevron otherwise */}
      {selected ? (
        <View
          className="ml-2 h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: track.accent }}
        >
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  listContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  ctaEnabled: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  hero: { width: "100%", height: 140, marginTop: 8 },
});
