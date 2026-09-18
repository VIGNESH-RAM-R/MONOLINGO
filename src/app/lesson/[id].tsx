import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { getLessonById } from "@/data/lessons";
import { colors, shadows } from "@/theme";

/**
 * Minimal lesson placeholder — tapping a lesson on the Learn screen
 * (prompts/11-lesson-ui.md) needs somewhere real to land. The actual
 * audio-lesson experience is specced separately (prompts/12-audio-lesson-ui.md)
 * and will replace this screen's contents.
 */
export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);

  if (!lesson) return <Redirect href="/learn" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-row items-center px-lg pt-sm">
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="px-lg mt-sm">
        <AppText variant="h1">{lesson.title}</AppText>
        <AppText variant="bodyMedium" className="text-text-secondary mt-xs">
          {lesson.goal}
        </AppText>

        <View className="rounded-2xl border border-border bg-white p-lg mt-lg" style={shadows.card}>
          <AppText variant="h3">Vocabulary</AppText>
          <View className="gap-sm mt-sm">
            {lesson.vocabulary.map((item) => (
              <View key={item.word} className="flex-row justify-between">
                <AppText variant="bodyMedium">{item.word}</AppText>
                <AppText variant="bodyMedium" className="text-text-secondary">
                  {item.translation}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-2xl border border-border bg-white p-lg mt-md" style={shadows.card}>
          <AppText variant="h3">Phrases</AppText>
          <View className="gap-sm mt-sm">
            {lesson.phrases.map((item) => (
              <View key={item.phrase}>
                <AppText variant="bodyMedium">{item.phrase}</AppText>
                <AppText variant="bodySmall" className="text-text-secondary">
                  {item.translation}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
