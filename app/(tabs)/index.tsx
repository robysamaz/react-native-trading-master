import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { images } from "@/constants/images";
import { getLessonsForUnit } from "@/data/lessons";
import { getUnitById, getUnitsForTrack } from "@/data/units";
import { withAlpha } from "@/lib/color";
import { posthog } from "@/lib/posthog";
import { useSelectedTrack, useTrackStore } from "@/store/track-store";
import { colors } from "@/theme/colors";
import type { Lesson, Track, Unit } from "@/types/learning";

// Home tab. Routing gates are preserved from prompt 09: wait for Clerk + the
// persisted track store, redirect signed-out users to onboarding and track-less
// users to track selection. Only the screen BODY below the gates is built here
// (prompt 10); the gating logic and the tab bar are untouched.
export default function HomeTab() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedTrack = useSelectedTrack();
  const hasHydrated = useTrackStore((state) => state.hasHydrated);
  const selectedTrackId = useTrackStore((state) => state.selectedTrackId);

  // Wait for BOTH Clerk and the persisted track store before routing — else we
  // could redirect on a not-yet-rehydrated `null` and flash track-selection at
  // a user who already has a track.
  if (!isLoaded || !hasHydrated) {
    return null;
  }

  // Signed-out users start at onboarding.
  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  // Authenticated but no track picked yet → choose one before reaching home.
  // A stale/unknown id (track removed) is treated the same way.
  if (!selectedTrackId || !selectedTrack) {
    return <Redirect href="/track-selection" />;
  }

  return <HomeScreen track={selectedTrack} />;
}

/**
 * The actual Home UI. Split out from the gate so `selectedTrack` is a guaranteed
 * non-null `Track` here and the curriculum hooks below stay readable.
 */
function HomeScreen({ track }: { track: Track }) {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const clearTrack = useTrackStore((state) => state.clearTrack);

  const handleSignOut = async () => {
    posthog.capture("sign_out", { method: "manual" });
    await signOut();
    // posthog.reset() fires automatically via IdentitySync on the signed-out transition.
    router.replace("/onboarding");
  };

  // Greeting: first name → email local part → "Trader".
  const greetingName =
    user?.firstName?.trim() ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Trader";

  // Curriculum for the selected track, in track order (unit order → lesson
  // order). Derived from data/ — no lesson copy is hardcoded in the screen.
  const trackUnits = getUnitsForTrack(track.id);
  const orderedLessons = trackUnits.flatMap((unit) => getLessonsForUnit(unit.id));

  // Current lesson = first "available" lesson in order, else the first lesson.
  const currentLesson =
    orderedLessons.find((lesson) => lesson.status === "available") ?? orderedLessons[0];
  const currentUnit = currentLesson ? getUnitById(currentLesson.unitId) : undefined;

  // Per-unit progress (completed vs total) for the "Your path" section.
  const unitProgress = trackUnits.map((unit) => {
    const lessons = getLessonsForUnit(unit.id);
    const completed = lessons.filter((lesson) => lesson.status === "completed").length;
    return { unit, completed, total: lessons.length };
  });

  // Total XP on offer across the track — a friendly "what this track is worth".
  const totalXp = orderedLessons.reduce((sum, lesson) => sum + lesson.xp, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.linguaPurple }}>
      <StatusBar style="light" />

      {/* ---- Purple header (greeting + current track line) ------------- */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.linguaPurple }}>
        <View className="flex-row items-center px-6 pb-7 pt-2">
          <Image
            source={images.mascotWelcome}
            contentFit="contain"
            style={styles.avatar}
          />
          <View className="ml-3 flex-1">
            <Text className="text-h3 text-white">Hi, {greetingName}! 👋</Text>
            <Text className="text-body-sm mt-0.5 text-white/80" numberOfLines={1}>
              {track.title} · {track.difficulty}
            </Text>
          </View>

          {/* XP-on-offer pill */}
          <View
            className="flex-row items-center rounded-full px-3 py-1.5"
            style={{ backgroundColor: withAlpha("#FFFFFF", 0.16) }}
          >
            <Ionicons name="flame" size={16} color={colors.warning} />
            <Text className="text-caption ml-1 font-poppins-semibold text-white">
              {totalXp} XP
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ---- White body (rounded over the purple header) -------------- */}
      <View style={styles.body}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ---- Continue learning ----------------------------------- */}
          {currentLesson ? (
            <ContinueLearningCard
              lesson={currentLesson}
              unit={currentUnit}
              accent={track.accent}
              onPress={() => {
                posthog.capture("lesson_opened", {
                  lesson_id: currentLesson.id,
                  lesson_title: currentLesson.title,
                  track_id: track.id,
                });
                router.push({ pathname: "/lesson/[id]", params: { id: currentLesson.id } });
              }}
            />
          ) : null}

          {/* ---- Your path / progress -------------------------------- */}
          <Text className="text-h3 mb-3 mt-7 text-text-primary">Your path</Text>
          <View
            className="overflow-hidden rounded-2xl border border-border bg-background"
            style={styles.pathCard}
          >
            {unitProgress.map(({ unit, completed, total }, index) => (
              <UnitRow
                key={unit.id}
                unit={unit}
                completed={completed}
                total={total}
                accent={track.accent}
                isLast={index === unitProgress.length - 1}
              />
            ))}
          </View>

          {/* ---- Today's plan ---------------------------------------- */}
          {currentLesson ? (
            <TodaysPlanCard lesson={currentLesson} accent={track.accent} />
          ) : null}

          {/* ---- Dev affordance: reset the persisted track ----------- */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={clearTrack}
            className="mt-8 flex-row items-center justify-center"
            hitSlop={8}
          >
            <Ionicons name="refresh" size={14} color={colors.textSecondary} />
            <Text className="text-caption ml-1.5 text-text-secondary">
              Clear track (dev)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSignOut}
            testID="sign-out-button"
            className="mt-3 flex-row items-center justify-center"
            hitSlop={8}
          >
            <Ionicons name="log-out-outline" size={16} color={colors.textSecondary} />
            <Text className="text-caption ml-1.5 text-text-secondary">Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

/** Prominent card for the user's current lesson — the primary call to action. */
function ContinueLearningCard({
  lesson,
  unit,
  accent,
  onPress,
}: {
  lesson: Lesson;
  unit: Unit | undefined;
  accent: string;
  onPress: () => void;
}) {
  return (
    <View
      className="flex-row items-center overflow-hidden rounded-[20px]"
      style={{ backgroundColor: accent }}
    >
      {/* Text column — flex-1 so the title has room and never clips the art */}
      <View className="flex-1 py-5 pl-5 pr-2">
        <Text className="text-caption font-poppins-semibold uppercase text-white/80">
          Continue learning
        </Text>
        <Text className="text-h3 mt-1 text-white" numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text className="text-body-sm mt-1 text-white/85" numberOfLines={1}>
          {unit ? `${unit.title} · ` : ""}
          {lesson.xp} XP
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          className="mt-4 flex-row items-center self-start rounded-full bg-white px-5 py-2.5"
        >
          <Text className="text-h4 mr-1" style={{ color: accent }}>
            Continue
          </Text>
          <Ionicons name="arrow-forward" size={18} color={accent} />
        </TouchableOpacity>
      </View>

      {/* Transparent hero art — sits beside the text, no white box */}
      <Image
        source={images.tradingHeroCutout}
        contentFit="contain"
        style={styles.continueArt}
      />
    </View>
  );
}

/** One unit row in the "Your path" list with a tinted progress indicator. */
function UnitRow({
  unit,
  completed,
  total,
  accent,
  isLast,
}: {
  unit: Unit;
  completed: number;
  total: number;
  accent: string;
  isLast: boolean;
}) {
  const fraction = total > 0 ? completed / total : 0;

  return (
    <View
      className={`flex-row items-center p-4 ${isLast ? "" : "border-b border-border"}`}
    >
      {/* Unit number tile */}
      <View
        className="h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: withAlpha(accent, 0.14) }}
      >
        <Text className="text-h4 font-poppins-bold" style={{ color: accent }}>
          {unit.order}
        </Text>
      </View>

      {/* Title + progress */}
      <View className="ml-3 flex-1">
        <Text className="text-h4 text-text-primary" numberOfLines={1}>
          {unit.title}
        </Text>
        <View className="mt-2">
          <ProgressBar progress={fraction} color={accent} />
        </View>
      </View>

      <Text className="text-body-sm ml-3 font-poppins-semibold text-text-secondary">
        {completed}/{total}
      </Text>
    </View>
  );
}

/**
 * Beginner-friendly nudge built from the current lesson's key terms — framing
 * only. Per the Educational Disclaimer Rule, it is never a live trade signal.
 */
function TodaysPlanCard({ lesson, accent }: { lesson: Lesson; accent: string }) {
  const terms = lesson.keyTerms.slice(0, 3);

  return (
    <View className="card--flat mt-7">
      <View className="flex-row items-center">
        <Ionicons name="bulb" size={18} color={accent} />
        <Text className="text-h4 ml-2 text-text-primary">Today&rsquo;s plan</Text>
      </View>

      <Text className="text-body-md mt-2 text-text-primary">
        Today: {lesson.title}
      </Text>
      <Text className="text-body-sm mt-1 text-text-secondary" numberOfLines={3}>
        {lesson.goal}
      </Text>

      {/* Key-term chips */}
      <View className="mt-3 flex-row flex-wrap">
        {terms.map((keyTerm) => (
          <View
            key={keyTerm.term}
            className="mb-2 mr-2 rounded-full px-3 py-1"
            style={{ backgroundColor: withAlpha(accent, 0.12) }}
          >
            <Text
              className="text-caption font-poppins-semibold"
              style={{ color: accent }}
            >
              {keyTerm.term}
            </Text>
          </View>
        ))}
      </View>

      <Text className="text-caption mt-1 text-text-secondary">
        Education only — concepts, not live trade signals or financial advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 40, height: 40, borderRadius: 20 },
  // Body overlaps the purple header slightly and rounds its top corners.
  body: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
  },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  pathCard: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  continueArt: { width: 118, height: 130, marginRight: 4 },
});
