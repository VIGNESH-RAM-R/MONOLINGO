import { View } from "react-native";

import { AppText } from "@/components/app-text";

// Placeholder — real Chat (AI tutor) UI isn't specced yet. This just proves
// the tab route and custom tab bar (prompts/09-bottom-tab-nav.md) work
// end-to-end.
export default function ChatScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <AppText variant="h2">Chat</AppText>
    </View>
  );
}
