import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonById } from "@/data/lessons";
import { withAlpha } from "@/lib/color";
import { posthog } from "@/lib/posthog";
import { useSelectedTrack } from "@/store/track-store";
import { colors } from "@/theme/colors";
import type { IconName, Lesson, Track } from "@/types/learning";

// AI Mentor audio lesson screen — prompt 12. Adapts the reference design (a
// language-learning video call) to this app's futures-trading domain as an
// AUDIO-ONLY session: the mentor area is a static visual placeholder, not a
// live camera feed. Session state is mocked with local UI state here; the real
// Stream audio + Vision Agents wiring lands in prompts 13–16, and live
// transcription replaces the seeded mentor lines in prompt 17. This file owns
// the screen body only — the tab bar and routing/gating from prior prompts are
// left untouched.
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);
  const track = useSelectedTrack();

  // "Lesson not found" fallback when the route id doesn't resolve.
  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="dark" />
        <View className="flex-row items-center px-6 pb-2 pt-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={12}
            className="absolute left-6 z-10"
          >
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text className="text-h3 flex-1 text-center text-text-primary">Lesson</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={40} color={colors.textSecondary} />
          <Text className="text-h3 mt-3 text-center text-text-primary">Lesson not found</Text>
          <Text className="text-body-md mt-2 text-center text-text-secondary">
            We couldn&apos;t find that lesson. Head back and pick another.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return <AudioLessonScreen lesson={lesson} track={track} />;
}

/** Mocked session phase. Becomes real Stream audio state in prompts 13–16. */
type SessionStatus = "connecting" | "speaking" | "listening";

/**
 * Builds the placeholder lines the mentor "speaks" this session. Seeded purely
 * from the lesson's own goal, key terms, and examples so the content stays
 * on-topic and inside the lesson — never a live signal or financial advice
 * (see the trading-domain guardrail in this prompt + data/lessons.ts). Live
 * transcription replaces this in prompt 17.
 */
function buildMentorScript(lesson: Lesson): string[] {
  const term = lesson.keyTerms[0];
  const example = lesson.examples[0];
  const lines = [
    `Welcome. In this session we focus on one thing: ${lesson.goal}`,
    term ? `Let's start with ${term.term} — ${term.definition}` : null,
    example ? `Here's a concrete read. ${example.scenario}` : null,
    "And the discipline never changes: protect capital first, risk at most 2% per trade, and only take setups offering at least 3:1 reward-to-risk. I teach the concept — I won't call a live trade for you.",
  ];
  return lines.filter((line): line is string => Boolean(line));
}

/** The audio lesson screen for a resolved lesson (track may be unset). */
function AudioLessonScreen({ lesson, track }: { lesson: Lesson; track?: Track }) {
  const accent = track?.accent ?? colors.linguaPurple;
  const script = useMemo(() => buildMentorScript(lesson), [lesson]);

  // ---- Local mock session state (UI only for now) -----------------------
  const [status, setStatus] = useState<SessionStatus>("connecting");
  const [lineIndex, setLineIndex] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // Simulate connecting → mentor greeting. Cleared on unmount.
  useEffect(() => {
    posthog.capture("lesson_session_started", {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      track_id: track?.id ?? null,
    });
    const timer = setTimeout(() => setStatus("speaking"), 1200);
    return () => clearTimeout(timer);
  }, [lesson.id, lesson.title, track?.id]);

  const statusMeta = STATUS_META(status, accent);
  const mentorLine = status === "connecting" ? null : script[lineIndex];
  const canAdvance = status !== "connecting";

  // Tap the mentor to walk through the seeded points; ends in "listening".
  const advanceMentor = () => {
    if (!canAdvance) return;
    if (lineIndex < script.length - 1) {
      setLineIndex((i) => i + 1);
      setStatus("speaking");
    } else {
      setStatus("listening");
    }
  };

  const endSession = () => {
    posthog.capture("lesson_session_ended", {
      lesson_id: lesson.id,
      track_id: track?.id ?? null,
      feedback,
    });
    router.back();
  };

  const rate = (value: "up" | "down") => {
    const next = feedback === value ? null : value;
    setFeedback(next);
    if (next) {
      posthog.capture("lesson_session_rated", {
        lesson_id: lesson.id,
        track_id: track?.id ?? null,
        rating: next,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />

      {/* ---- Header: nav + lesson context -------------------------------- */}
      <View className="px-6 pb-1 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={12}
            className="absolute left-0 z-10"
          >
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center justify-center">
            <Text className="text-h4 text-text-primary">AI Mentor</Text>
            <View className="ml-2 h-2 w-2 rounded-full" style={{ backgroundColor: colors.success }} />
            <Text className="text-caption ml-1 text-text-secondary">Online</Text>
          </View>
        </View>

        <View className="mt-3">
          {track ? (
            <Text
              className="text-caption font-poppins-semibold uppercase"
              style={{ color: accent }}
              numberOfLines={1}
            >
              {track.title}
            </Text>
          ) : null}
          <Text className="text-h3 mt-0.5 text-text-primary" numberOfLines={2}>
            {lesson.title}
          </Text>
          <Text className="text-body-sm mt-1 text-text-secondary" numberOfLines={2}>
            {lesson.goal}
          </Text>
        </View>
      </View>

      {/* ---- Mentor preview (static placeholder, NOT a camera feed) ------- */}
      <Pressable
        onPress={advanceMentor}
        className="mx-6 mt-3 flex-1 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: withAlpha(accent, 0.1) }}
      >
        <Image
          source={images.mascotWelcome}
          contentFit="contain"
          style={StyleSheet.absoluteFill}
        />

        {/* Session status indicator (top-left), driven by mock state. */}
        <View
          className="absolute left-4 top-4 flex-row items-center rounded-full px-3 py-1.5"
          style={{ backgroundColor: withAlpha(colors.textPrimary, 0.55) }}
        >
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: statusMeta.dot }} />
          <Text className="text-caption ml-2 font-poppins-semibold text-white">
            {statusMeta.label}
          </Text>
        </View>

        {/* Mentor response bubble — seeded transcript; live in prompt 17. */}
        {captionsOn && mentorLine ? (
          <View className="absolute inset-x-4 bottom-4">
            <View className="flex-row items-start rounded-2xl bg-white p-4" style={styles.bubble}>
              <Ionicons name="volume-high" size={18} color={accent} style={{ marginTop: 2 }} />
              <Text className="text-body-sm ml-3 flex-1 text-text-primary">{mentorLine}</Text>
            </View>
          </View>
        ) : null}
      </Pressable>

      {/* Tap-to-continue hint while the mentor still has points to make. */}
      <Text className="text-caption mt-2 text-center text-text-secondary">
        {canAdvance && lineIndex < script.length - 1
          ? "Tap the mentor to continue"
          : "Concepts only — not live trade signals or financial advice"}
      </Text>

      {/* ---- Audio controls --------------------------------------------- */}
      <View className="mt-4 flex-row items-start justify-center px-6">
        <ControlButton
          icon={micMuted ? "mic-off" : "mic"}
          label={micMuted ? "Unmute" : "Mute"}
          active={micMuted}
          accent={accent}
          onPress={() => setMicMuted((m) => !m)}
        />
        <View className="w-8" />
        <ControlButton
          icon={captionsOn ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
          label="Captions"
          active={captionsOn}
          accent={accent}
          onPress={() => setCaptionsOn((c) => !c)}
        />
        <View className="w-8" />
        <ControlButton
          icon="stop"
          label="End session"
          danger
          accent={accent}
          onPress={endSession}
        />
      </View>

      {/* ---- Lesson feedback (local only; persistence comes later) ------- */}
      <View className="mx-6 mb-4 mt-5 flex-row items-center justify-between rounded-2xl border border-border p-4">
        <Text className="text-h4 flex-1 pr-3 text-text-primary">How was this session?</Text>
        <View className="flex-row">
          <FeedbackButton
            icon="thumbs-up"
            active={feedback === "up"}
            accent={accent}
            onPress={() => rate("up")}
          />
          <View className="w-3" />
          <FeedbackButton
            icon="thumbs-down"
            active={feedback === "down"}
            accent={colors.error}
            onPress={() => rate("down")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Status pill label + dot color for the current mock session phase. */
function STATUS_META(status: SessionStatus, accent: string): { label: string; dot: string } {
  switch (status) {
    case "connecting":
      return { label: "Connecting…", dot: colors.warning };
    case "speaking":
      return { label: "Mentor speaking", dot: accent };
    case "listening":
    default:
      return { label: "Listening", dot: colors.success };
  }
}

/** A circular audio control. Active state and accent tint with the track color. */
function ControlButton({
  icon,
  label,
  onPress,
  accent,
  active = false,
  danger = false,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  accent: string;
  active?: boolean;
  danger?: boolean;
}) {
  const background = danger ? colors.error : active ? accent : colors.surface;
  const foreground = danger || active ? "#FFFFFF" : colors.textPrimary;

  return (
    <View className="items-center" style={{ width: 72 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.controlBtn, { backgroundColor: background }]}
      >
        <Ionicons name={icon} size={24} color={foreground} />
      </TouchableOpacity>
      <Text className="text-caption mt-2 text-center text-text-secondary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Thumbs feedback control; fills with its accent when selected. */
function FeedbackButton({
  icon,
  active,
  accent,
  onPress,
}: {
  icon: IconName;
  active: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.feedbackBtn,
        {
          backgroundColor: active ? withAlpha(accent, 0.12) : colors.surface,
          borderColor: active ? accent : colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={active ? accent : colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
});
