import { Tabs } from "expo-router";

import { TabBar } from "@/components/tab-bar";

/**
 * Bottom tab navigator — see prompts/09-bottom-tab-nav.md. Screen order here
 * is also the tab order, and must match src/components/tab-bar.tsx's
 * TAB_CONFIG keys (the route/file names below).
 */
export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="ai-teacher" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
