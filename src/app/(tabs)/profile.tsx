import { View } from "react-native";

import { AppText } from "@/components/app-text";

// Placeholder — real Profile UI isn't specced yet. This just proves the tab
// route and custom tab bar (prompts/09-bottom-tab-nav.md) work end-to-end.
export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppText variant="h2">Profile</AppText>
    </View>
  );
}
