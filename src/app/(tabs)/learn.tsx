import { useState } from "react";
import type { ComponentProps } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { getLessonsForUnit } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import { asHref } from "@/lib/auth-navigation";
import { cn } from "@/lib/cn";
import { useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors, shadows } from "@/theme";
import type { Lesson } from "@/types/learning";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Colored icon-circle treatment cycled by lesson order (1-indexed). */
const LESSON_STYLES: { bgClassName: string; color: string }[] = [
  { bgClassName: "bg-success/10", color: colors.success },
  { bgClassName: "bg-lingo-blue/10", color: colors.lingoBlue },
  { bgClassName: "bg-lingo-purple/10", color: colors.lingoPurple },
  { bgClassName: "bg-error/10", color: colors.error },
  { bgClassName: "bg-mono-orange/10", color: colors.monoOrange },
  { bgClassName: "bg-lingo-purple/10", color: colors.lingoPurple },
];

/** Small decorative emoji next to the in-progress lesson, cycled the same way. */
const LESSON_EMOJI = ["👋", "☀️", "🥐", "🧭", "🛍️", "👨‍👩‍👧"];

type Tab = "lessons" | "practice";

/**
 * Lessons screen — matches prompt_material/06-lesson-screen.png.
 *
 * Every language now has one unit (data/units.ts) with 6 lessons
 * (data/lessons.ts), so this always has real content to show regardless of
 * which language is selected.
 */
export default function LearnScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("lessons");
  const [bookmarked, setBookmarked] = useState(false);

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const completedLessonIds = useLearningProgressStore((state) => state.completedLessonIds);

  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;
  const unit = selectedLanguage ? getUnitsForLanguage(selectedLanguage)[0] : undefined;
  const lessons = unit ? getLessonsForUnit(unit.id) : [];

  const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const currentLesson = lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[lessons.length - 1];

  if (!language || !unit || !currentLesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-lg">
          <AppText variant="h3" className="text-center">
            Pick a language to see its lessons
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-lg pt-sm">
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace(asHref("/")))}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>

        <View className="flex-row items-center gap-xs">
          <Image source={images.mascotLogo} className="w-8 h-8" resizeMode="contain" />
          <AppText variant="h4">
            MONO<AppText variant="h4" className="text-lingo-purple">LINGO</AppText>
          </AppText>
        </View>

        <TouchableOpacity onPress={() => setBookmarked((value) => !value)} hitSlop={12}>
          <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={24} color={colors.lingoPurple} />
        </TouchableOpacity>
      </View>

      {/* Title block, with the unit's tagline floated top-right */}
      <View className="px-lg mt-md">
        <AppText variant="h1">{currentLesson.title}</AppText>
        <AppText variant="bodySmall" className="text-text-secondary mt-1">
          {language.name} &bull; Unit {unit.order} &bull; {completedCount} / {lessons.length} lessons
        </AppText>
        <AppText variant="bodyMedium" className="text-text-secondary mt-xs pr-20">
          {currentLesson.goal}
        </AppText>

        <View className="absolute top-0 right-lg max-w-[130px]">
          <AppText variant="bodyMedium" className="text-lingo-purple italic text-right">
            {unit.tagline}
          </AppText>
        </View>
      </View>

      {/* Hero image + lesson list sheet, both scroll together */}
      <View className="flex-1">
        {unit.imageUrl && (
          <Image source={{ uri: unit.imageUrl }} resizeMode="cover" className="absolute top-0 left-0 right-0 h-full" />
        )}

        <View className="mt-[180px] flex-1 rounded-t-[32px] bg-white px-lg pt-md" style={shadows.overlay}>
          {/* Lessons / Practice segmented control */}
          <View className="flex-row rounded-full bg-surface p-1">
            <SegmentButton label="Lessons" active={tab === "lessons"} onPress={() => setTab("lessons")} />
            <SegmentButton label="Practice" active={tab === "practice"} onPress={() => setTab("practice")} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            <View className="gap-sm mt-md">
              {tab === "lessons" ? (
                lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={completedLessonIds.includes(lesson.id)}
                    isCurrent={lesson.id === currentLesson.id}
                    completedCount={completedCount}
                    totalCount={lessons.length}
                    onPress={() => router.push({ pathname: "/lesson/[id]", params: { id: lesson.id } })}
                  />
                ))
              ) : (
                <View className="items-center rounded-2xl border border-border bg-surface px-lg py-xl">
                  <Ionicons name="game-controller-outline" size={28} color={colors.textSecondary} />
                  <AppText variant="h4" className="mt-sm text-center">
                    Practice mode coming soon!
                  </AppText>
                  <AppText variant="bodySmall" className="text-text-secondary text-center mt-xs">
                    Quick drills to review vocabulary from lessons you&rsquo;ve completed.
                  </AppText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

type SegmentButtonProps = { label: string; active: boolean; onPress: () => void };

function SegmentButton({ label, active, onPress }: SegmentButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={cn("flex-1 items-center rounded-full py-sm", active && "bg-lingo-purple")}
    >
      <AppText variant="h4" className={active ? "text-white" : "text-text-secondary"}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

type LessonRowProps = {
  lesson: Lesson;
  isCompleted: boolean;
  isCurrent: boolean;
  completedCount: number;
  totalCount: number;
  onPress: () => void;
};

function LessonRow({ lesson, isCompleted, isCurrent, completedCount, totalCount, onPress }: LessonRowProps) {
  const style = LESSON_STYLES[(lesson.order - 1) % LESSON_STYLES.length];
  const emoji = LESSON_EMOJI[(lesson.order - 1) % LESSON_EMOJI.length];
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-sm rounded-2xl border px-md py-sm",
        isCurrent ? "border-lingo-purple bg-lingo-purple/5" : "border-border bg-white",
      )}
      style={shadows.card}
    >
      <View className={cn("w-12 h-12 rounded-xl items-center justify-center", style.bgClassName)}>
        <Ionicons name={lesson.icon as IoniconName} size={22} color={style.color} />
      </View>

      <View className="flex-1">
        <AppText variant="caption" className={isCurrent ? "text-lingo-purple" : "text-text-secondary"}>
          Lesson {lesson.order}
        </AppText>
        <AppText variant="h4">{lesson.title}</AppText>
        <AppText variant="bodySmall" className="text-text-secondary">
          {lesson.subtitle}
        </AppText>

        {isCurrent && (
          <View className="mt-sm">
            <View className="h-1.5 rounded-full bg-lingo-purple/15 overflow-hidden">
              <View className="h-1.5 rounded-full bg-lingo-purple" style={{ width: `${progress * 100}%` }} />
            </View>
            <AppText variant="caption" className="text-lingo-purple mt-1">
              In progress &bull; {completedCount} / {totalCount} lessons
            </AppText>
          </View>
        )}
      </View>

      {isCompleted ? (
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      ) : isCurrent ? (
        <AppText variant="h3">{emoji}</AppText>
      ) : (
        <Ionicons name="lock-closed-outline" size={20} color={colors.border} />
      )}
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
