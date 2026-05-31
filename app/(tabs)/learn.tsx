import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonsForUnit } from "@/data/lessons";
import { getUnitsForTrack } from "@/data/units";
import { withAlpha } from "@/lib/color";
import { posthog } from "@/lib/posthog";
import { useSelectedTrack, useTrackStore } from "@/store/track-store";
import { colors } from "@/theme/colors";
import type { IconName, Lesson, LessonStatus, Track, Unit } from "@/types/learning";

// Learn tab — the Lessons screen. Built per prompt 11, adapted from the
// reference design to this app's futures-trading domain. The tab bar and the
// signed-in / track-selected gating from prior prompts are left untouched; this
// file only owns the screen BODY. Curriculum is read from data/ (units +
// lessons) for the selected track — no lesson copy is hardcoded here.
export default function LearnTab() {
  const router = useRouter();
  const track = useSelectedTrack();
  const hasHydrated = useTrackStore((state) => state.hasHydrated);

  // Wait for the persisted track store before deciding what to show.
  if (!hasHydrated) {
    return null;
  }

  // Defensive: a user reaches the tabs only after picking a track, but if the
  // selection is missing/stale, point them back to track selection rather than
  // rendering an empty list.
  if (!track) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="book-outline" size={40} color={colors.textSecondary} />
          <Text className="text-h3 mt-3 text-center text-text-primary">No track selected</Text>
          <Text className="text-body-md mt-2 text-center text-text-secondary">
            Choose a learning path to see your lessons.
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/track-selection")}
            className="mt-5 rounded-full px-5 py-2.5"
            style={{ backgroundColor: colors.linguaPurple }}
          >
            <Text className="text-h4 text-white">Choose a track</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return <LessonsScreen track={track} />;
}

/** The Lessons screen for a guaranteed non-null track. */
function LessonsScreen({ track }: { track: Track }) {
  const router = useRouter();
  const accent = track.accent;

  // Optional `unit` param (set when arriving from a "Your path" row on Home).
  // When present, scroll that unit's section into view. Offsets are captured as
  // each section lays out, so this works whether the tab mounts fresh or is
  // already alive with a new param.
  const { unit: focusUnitId } = useLocalSearchParams<{ unit?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const handledFocus = useRef<string | null>(null);

  const scrollToUnit = useCallback((unitId: string) => {
    const y = sectionOffsets.current[unitId];
    if (y == null) return false;
    scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
    return true;
  }, []);

  useEffect(() => {
    if (focusUnitId && handledFocus.current !== focusUnitId) {
      if (scrollToUnit(focusUnitId)) handledFocus.current = focusUnitId;
    }
  }, [focusUnitId, scrollToUnit]);

  const handleSectionMeasure = (unitId: string, y: number) => {
    sectionOffsets.current[unitId] = y;
    // First layout after navigating to a not-yet-measured section.
    if (focusUnitId === unitId && handledFocus.current !== focusUnitId) {
      if (scrollToUnit(unitId)) handledFocus.current = focusUnitId;
    }
  };

  // Units in order, each paired with its lessons in order. Pure read from data/.
  const sections = getUnitsForTrack(track.id).map((unit) => ({
    unit,
    lessons: getLessonsForUnit(unit.id),
  }));

  const allLessons = sections.flatMap((section) => section.lessons);
  const totalXp = allLessons.reduce((sum, lesson) => sum + lesson.xp, 0);
  const completedCount = allLessons.filter((l) => l.status === "completed").length;

  const openLesson = (lesson: Lesson) => {
    posthog.capture("lesson_opened", {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      track_id: track.id,
      source: "lessons_screen",
    });
    router.push({ pathname: "/lesson/[id]", params: { id: lesson.id } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />

      {/* ---- Header: track title + difficulty badge ------------------- */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.background }}>
        <View className="px-6 pb-3 pt-2">
          <Text className="text-h2 text-text-primary" numberOfLines={2}>
            {track.title}
          </Text>
          <View className="mt-2 flex-row items-center">
            <View
              className="flex-row items-center rounded-full px-3 py-1"
              style={{ backgroundColor: withAlpha(accent, 0.12) }}
            >
              <Ionicons name={track.icon} size={13} color={accent} />
              <Text
                className="text-caption ml-1 font-poppins-semibold"
                style={{ color: accent }}
              >
                {track.difficulty}
              </Text>
            </View>
            <Text className="text-caption ml-2 text-text-secondary">
              {completedCount}/{allLessons.length} done · {totalXp} XP
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Hero banner (track art on accent) ---------------------- */}
        <View
          className="flex-row items-center overflow-hidden rounded-[20px]"
          style={{ backgroundColor: accent }}
        >
          <View className="flex-1 py-5 pl-5 pr-2">
            <Text className="text-caption font-poppins-semibold uppercase text-white/80">
              Your lessons
            </Text>
            <Text className="text-h4 mt-1 text-white" numberOfLines={3}>
              {track.subtitle}
            </Text>
          </View>
          <Image
            source={images.tradingHeroCutout}
            contentFit="contain"
            style={styles.heroArt}
          />
        </View>

        {/* ---- Unit sections ----------------------------------------- */}
        {sections.map(({ unit, lessons }) => (
          <UnitSection
            key={unit.id}
            unit={unit}
            lessons={lessons}
            accent={accent}
            onOpenLesson={openLesson}
            onMeasure={handleSectionMeasure}
          />
        ))}

        {/* ---- Educational disclaimer (AGENTS → Educational Rule) ----- */}
        <Text className="text-caption mt-7 text-center text-text-secondary">
          Educational content — concepts only, not live trade signals or financial advice.
        </Text>
      </ScrollView>
    </View>
  );
}

/** One unit rendered as a section header with its lessons listed beneath. */
function UnitSection({
  unit,
  lessons,
  accent,
  onOpenLesson,
  onMeasure,
}: {
  unit: Unit;
  lessons: Lesson[];
  accent: string;
  onOpenLesson: (lesson: Lesson) => void;
  /** Reports this section's y-offset within the scroll content (for focus scroll). */
  onMeasure: (unitId: string, y: number) => void;
}) {
  const completed = lessons.filter((l) => l.status === "completed").length;

  return (
    <View
      className="mt-7"
      onLayout={(e) => onMeasure(unit.id, e.nativeEvent.layout.y)}
    >
      <View className="flex-row items-center">
        <Text className="text-h3 flex-1 text-text-primary" numberOfLines={2}>
          {unit.title}
        </Text>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: withAlpha(accent, 0.12) }}
        >
          <Text className="text-caption font-poppins-semibold" style={{ color: accent }}>
            {completed}/{lessons.length}
          </Text>
        </View>
      </View>
      <Text className="text-body-sm mt-1 text-text-secondary">{unit.subtitle}</Text>

      <View className="mt-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            accent={accent}
            onPress={() => onOpenLesson(lesson)}
          />
        ))}
      </View>
    </View>
  );
}

/** Visual treatment for a lesson's status. Accents tint with the track color. */
function statusVisual(
  status: LessonStatus,
  accent: string,
): { icon: IconName; tint: string; label: string; highlighted: boolean } {
  switch (status) {
    case "completed":
      return { icon: "checkmark-circle", tint: accent, label: "Completed", highlighted: false };
    case "in-progress":
      return { icon: "play-circle", tint: accent, label: "In progress", highlighted: true };
    case "locked":
      return {
        icon: "lock-closed",
        tint: colors.textSecondary,
        label: "Locked",
        highlighted: false,
      };
    case "available":
    default:
      return { icon: "ellipse-outline", tint: accent, label: "Start", highlighted: false };
  }
}

/**
 * A single lesson card: number label, title, one-line goal, XP, and a status
 * indicator. No status blocks opening — `status` only drives the visual (the
 * in-progress lesson is highlighted with the track accent).
 */
function LessonCard({
  lesson,
  accent,
  onPress,
}: {
  lesson: Lesson;
  accent: string;
  onPress: () => void;
}) {
  const visual = statusVisual(lesson.status, accent);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border p-4"
      style={{
        borderColor: visual.highlighted ? accent : colors.border,
        backgroundColor: visual.highlighted ? withAlpha(accent, 0.06) : colors.background,
      }}
    >
      <View className="flex-1 pr-3">
        <Text
          className="text-caption font-poppins-semibold uppercase"
          style={{ color: accent }}
        >
          Lesson {lesson.order}
        </Text>
        <Text className="text-h4 mt-0.5 text-text-primary" numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text className="text-body-sm mt-1 text-text-secondary" numberOfLines={2}>
          {lesson.goal}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="flame" size={13} color={colors.streak} />
          <Text className="text-caption ml-1 font-poppins-semibold text-text-secondary">
            {lesson.xp} XP
          </Text>
          <View className="mx-2 h-1 w-1 rounded-full bg-border" />
          <Text className="text-caption font-poppins-semibold" style={{ color: visual.tint }}>
            {visual.label}
          </Text>
        </View>
      </View>

      <Ionicons name={visual.icon} size={28} color={visual.tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  heroArt: { width: 104, height: 116, marginRight: 4 },
});
