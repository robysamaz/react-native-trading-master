import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLessonById } from "@/data/lessons";
import { colors } from "@/theme/colors";

// Lesson screen — PLACEHOLDER. The full interactive lesson UI is built in
// prompt 11. For now this just resolves the lesson id from the route so the
// Home screen's "Continue" action has a real destination to link to.
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);

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
        <Text className="text-h2 text-center text-text-primary">
          {lesson?.title ?? "Lesson not found"}
        </Text>
        {lesson ? (
          <Text className="text-body-md mt-3 text-center text-text-secondary">
            {lesson.goal}
          </Text>
        ) : null}
        <Text className="text-caption mt-6 text-center text-text-secondary">
          Full lesson experience coming in prompt 11.
        </Text>
      </View>
    </SafeAreaView>
  );
}
