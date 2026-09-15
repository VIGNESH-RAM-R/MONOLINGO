import { View } from "react-native";

import { AppText } from "@/components/app-text";

// Placeholder — real AI Teacher (video lesson) UI isn't specced yet. This
// just proves the tab route and custom tab bar (prompts/09-bottom-tab-nav.md)
// work end-to-end. Labeled "Mono" in the tab bar, after the app's mascot.
export default function AiTeacherScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppText variant="h2">AI Teacher</AppText>
    </View>
  );
}
