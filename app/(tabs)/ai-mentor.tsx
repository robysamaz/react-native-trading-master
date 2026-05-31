import { Text, View } from "react-native";

// AI Mentor tab — placeholder. Wired to the Stream Vision Agents mentor
// (aiMentorPrompt in data/lessons.ts) in a later prompt.
export default function AiMentorTab() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-h1 text-center text-lingua-purple">AI Mentor</Text>
      <Text className="text-body-md mt-3 text-center text-text-secondary">
        Coming soon
      </Text>
    </View>
  );
}
