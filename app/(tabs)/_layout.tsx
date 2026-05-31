import { Tabs } from "expo-router";

import { TabBar } from "@/components/TabBar";

// Tab order here defines the order shown in the bar (Home, Learn, AI Mentor,
// Chat, Profile). The custom <TabBar /> draws the icons, labels, and the
// sliding active circle — these screenOptions just register the routes.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-mentor" options={{ title: "AI Mentor" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
