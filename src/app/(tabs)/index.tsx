import type { ComponentProps, ReactNode } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { Flag } from "@/components/flag";
import { posthog } from "@/config/posthog";
import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById, getLessonsForLanguage } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import { asHref, useAuthDestination } from "@/lib/auth-navigation";
import { cn } from "@/lib/cn";
import { useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors, shadows, spacing } from "@/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const FLAG_SIZE = { width: 40, height: 40 };
// Natural pixel size of assets/assets/images/mascot-welcome.png — same
// constant as src/app/language-selection.tsx, sized for the Continue
// Learning card's smaller mascot instead.
const MASCOT_ASPECT_RATIO = 915 / 1044;
const MASCOT_WIDTH = 96;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Home — matches prompt_material/05-home-and-tab-navigation.png.
 *
 * Only Spanish, French, and Mandarin have real unit/lesson content in
 * data/units.ts + data/lessons.ts so far (see data/languages.ts), so the
 * Continue Learning card and the first Today's Adventure row fall back to a
 * "coming soon" state for every other selected language instead of assuming
 * content exists.
 */
export default function Index() {
  const router = useRouter();
  const { user } = useUser();
  const destination = useAuthDestination();

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const streak = useLearningProgressStore((state) => state.streak);
  const gems = useLearningProgressStore((state) => state.gems);
  const dailyXp = useLearningProgressStore((state) => state.dailyXp);
  const dailyGoalXp = useLearningProgressStore((state) => state.dailyGoalXp);
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);

  // Still restoring the session, or no longer the "signed in, language
  // picked" case — same guard as the stub this replaces.
  if (destination === null) return null;
  if (destination !== "/") return <Redirect href={asHref(destination)} />;

  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;
  const units = selectedLanguage ? getUnitsForLanguage(selectedLanguage) : [];
  const lessons = selectedLanguage ? getLessonsForLanguage(selectedLanguage) : [];
  const currentUnit = units[0];
  const currentLesson = lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0];

  // The greetings lesson's first vocabulary entry is literally the target
  // language's word for "hello" — reused here for the Continue Learning
  // card's speech bubble instead of hardcoding a translation per language.
  const greetingWord = selectedLanguage ? getLessonById(`${selectedLanguage}-greetings`)?.vocabulary[0]?.word : undefined;

  const progress = dailyGoalXp > 0 ? Math.min(dailyXp / dailyGoalXp, 1) : 0;
  const firstName = user?.firstName ?? "there";
  const mascotHeight = MASCOT_WIDTH / MASCOT_ASPECT_RATIO;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-lg pt-sm">
          <View className="flex-row items-center gap-sm flex-1 pr-md">
            {language && <Flag code={language.flagCode} size={FLAG_SIZE} className="rounded-full" />}
            <View className="flex-1">
              <AppText variant="bodySmall" className="text-text-secondary">
                {getGreeting()},
              </AppText>
              <AppText variant="h3" numberOfLines={1}>
                {firstName}! 👋
              </AppText>
            </View>
          </View>

          <View className="flex-row items-center gap-md">
            <View className="flex-row items-center gap-1">
              <Ionicons name="flame" size={18} color={colors.streak} />
              <AppText variant="h4">{streak}</AppText>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="diamond" size={16} color={colors.lingoBlue} />
              <AppText variant="h4">{gems}</AppText>
            </View>
            <TouchableOpacity hitSlop={8}>
              <View>
                <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
                <View className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-error" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <AppText variant="bodySmall" className="text-text-secondary px-lg mt-1">
          Mono has a new challenge for you today.
        </AppText>

        {/* Daily Expedition */}
        <View
          className="flex-row items-center justify-between rounded-2xl bg-mono-orange/10 mx-lg mt-lg p-lg"
          style={shadows.card}
        >
          <View className="flex-1 pr-md">
            <View className="flex-row items-center gap-1">
              <Ionicons name="compass-outline" size={16} color={colors.monoOrange} />
              <AppText variant="h4">Daily Expedition</AppText>
            </View>
            <View className="flex-row items-baseline gap-1 mt-sm">
              <AppText variant="h1">{dailyXp}</AppText>
              <AppText variant="bodyLarge" className="text-text-secondary">
                / {dailyGoalXp} XP
              </AppText>
            </View>
            <View className="h-2 rounded-full bg-white mt-sm overflow-hidden">
              {/* Dynamic width per AGENTS.md's "Dynamic styles" exception. */}
              <View className="h-2 rounded-full bg-lingo-purple" style={{ width: `${progress * 100}%` }} />
            </View>
            <AppText variant="caption" className="text-text-secondary mt-xs">
              Complete today&rsquo;s journey to unlock rewards.
            </AppText>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-mono-orange items-center justify-center" style={shadows.raised}>
              <Ionicons name="compass" size={30} color="#fff" />
            </View>
            <View className="rounded-full bg-mono-orange px-sm py-0.5 mt-xs">
              <AppText variant="caption" className="text-white font-poppins-semibold">
                KEEP GOING!
              </AppText>
            </View>
          </View>
        </View>

        {/* Continue Learning */}
        <View className="rounded-2xl overflow-hidden mx-lg mt-lg" style={shadows.raised}>
          <LinearGradient
            colors={[colors.lingoPurple, colors.lingoBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            // LinearGradient doesn't support className (no cssInterop
            // registration for it), so its own box model stays inline per
            // AGENTS.md's style-exception rules; its children below are
            // still styled with NativeWind as normal.
            style={{ padding: spacing.lg }}
          >
            {currentUnit?.imageUrl && (
              <Image
                source={{ uri: currentUnit.imageUrl }}
                resizeMode="cover"
                className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20"
              />
            )}

            <View className="flex-row justify-between">
              <View style={{ flex: 1 }}>
                <AppText variant="bodySmall" className="text-white/80">
                  Continue Learning
                </AppText>
                <AppText variant="h1" className="text-white mt-1">
                  {language?.name ?? "Your language"}
                </AppText>

                {currentUnit && (
                  <AppText variant="bodySmall" className="text-white/80 mt-1">
                    Unit {currentUnit.order} &bull; {currentUnit.title}
                  </AppText>
                )}

                {currentLesson ? (
                  <View className="flex-row items-center gap-1 mt-sm">
                    <Ionicons name={currentLesson.icon as IoniconName} size={16} color="#fff" />
                    <AppText variant="bodyMedium" className="text-white">
                      {currentLesson.title}
                    </AppText>
                  </View>
                ) : (
                  <AppText variant="bodyMedium" className="text-white mt-sm">
                    New lessons coming soon!
                  </AppText>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!currentLesson}
                  className="flex-row items-center gap-1 self-start rounded-full bg-white px-md py-sm mt-md"
                  onPress={() => {}}
                >
                  <Ionicons name="play" size={14} color={colors.lingoPurple} />
                  <AppText variant="h4" className="text-lingo-purple">
                    Continue Journey
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={{ width: MASCOT_WIDTH, alignItems: "flex-end" }}>
                {greetingWord && (
                  <View className="rounded-lg bg-white px-sm py-1 mb-1" style={shadows.card}>
                    <AppText variant="caption" className="text-lingo-purple font-poppins-semibold">
                      {capitalize(greetingWord)}!
                    </AppText>
                  </View>
                )}
                <Image
                  source={images.mascotWelcome}
                  resizeMode="contain"
                  style={{ width: MASCOT_WIDTH, height: mascotHeight }}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Today's Adventure */}
        <View className="flex-row items-center justify-between px-lg mt-xl mb-sm">
          <View className="flex-row items-center gap-1">
            <Ionicons name="compass-outline" size={16} color={colors.textPrimary} />
            <AppText variant="h3">Today&rsquo;s Adventure</AppText>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => router.push("/learn")}
            hitSlop={8}
          >
            <AppText variant="bodyMedium" className="text-lingo-purple">
              View all
            </AppText>
            <Ionicons name="chevron-forward" size={14} color={colors.lingoPurple} />
          </TouchableOpacity>
        </View>

        <View className="gap-sm px-lg">
          <AdventureRow
            icon={<Ionicons name={currentLesson ? (currentLesson.icon as IoniconName) : "book-outline"} size={20} color="#fff" />}
            iconBgClassName="bg-lingo-purple"
            title={currentLesson?.title ?? "Lesson"}
            subtitle={currentLesson?.subtitle ?? "New content coming soon"}
            checked={currentLesson ? completedLessonIds.includes(currentLesson.id) : false}
          />
          <AdventureRow
            icon={<Ionicons name="headset-outline" size={20} color="#fff" />}
            iconBgClassName="bg-lingo-blue"
            title="AI Speaking"
            subtitle="Practice with Mono"
            checked={false}
            onPress={() => {
              posthog?.capture("ai_conversation_started", { entry_point: "adventure_row" });
              router.push("/ai-teacher");
            }}
          />
          <AdventureRow
            icon={<MaterialCommunityIcons name="brain" size={20} color="#fff" />}
            iconBgClassName="bg-[#FF6B4A]"
            title="Vocabulary Quest"
            subtitle="10 New Words"
            checked={false}
          />
          <AdventureRow
            icon={<Ionicons name="game-controller-outline" size={20} color="#fff" />}
            iconBgClassName="bg-mono-orange"
            title="Mini Challenge"
            subtitle="Word Match Game"
            checked={false}
          />
        </View>

        {/* Talk with Mono Live */}
        <View
          className="flex-row items-center justify-between rounded-2xl bg-success/10 mx-lg mt-lg p-lg"
          style={shadows.card}
        >
          <View className="flex-1 pr-md">
            <AppText variant="h3">Talk with Mono Live</AppText>
            <AppText variant="bodySmall" className="text-text-secondary mt-1">
              Practice real conversations in any language.
            </AppText>
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center gap-1 self-start rounded-full bg-success px-md py-sm mt-md"
              onPress={() => {
                posthog?.capture("ai_conversation_started", { entry_point: "home_cta" });
                router.push("/ai-teacher");
              }}
            >
              <Ionicons name="mic" size={16} color="#fff" />
              <AppText variant="h4" className="text-white">
                Start Conversation
              </AppText>
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <Image source={images.mascotLogo} className="w-16 h-16 rounded-full" resizeMode="cover" />
            <View className="rounded-lg bg-white px-sm py-1 mt-1" style={shadows.card}>
              <AppText variant="caption" className="text-success font-poppins-semibold">
                Let&rsquo;s speak again!
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AdventureRowProps = {
  icon: ReactNode;
  iconBgClassName: string;
  title: string;
  subtitle: string;
  checked: boolean;
  onPress?: () => void;
};

/** One row in the Today's Adventure checklist. */
function AdventureRow({ icon, iconBgClassName, title, subtitle, checked, onPress }: AdventureRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
      onPress={onPress}
      className="flex-row items-center gap-sm rounded-xl border border-border bg-white px-md py-sm"
      style={shadows.card}
    >
      <View className={cn("w-10 h-10 rounded-xl items-center justify-center", iconBgClassName)}>{icon}</View>

      <View className="flex-1">
        <AppText variant="h4">{title}</AppText>
        <AppText variant="bodySmall" className="text-text-secondary">
          {subtitle}
        </AppText>
      </View>

      {checked ? (
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      ) : (
        <Ionicons name="ellipse-outline" size={24} color={colors.border} />
      )}
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
