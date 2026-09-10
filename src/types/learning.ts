import type { FlagCode } from "@/components/flag";

/**
 * Shared types for the hardcoded learning content in `data/`.
 *
 * Everything here is static lesson *content*. The learner's progress (XP,
 * completed lessons, streak, selected language, ...) is runtime state and
 * belongs in a Zustand store instead (see prompts/08-zustand.md) — it does
 * not live in this data.
 */

/** The 10 languages the app supports end to end. */
export type LanguageCode = "fr" | "es" | "de" | "hi" | "kn" | "cn" | "ja" | "ko" | "te" | "ml";

export type Language = {
  code: LanguageCode;
  /** English name, e.g. "Spanish". */
  name: string;
  /** Name in the language itself, e.g. "Español". */
  nativeName: string;
  /**
   * Which `Flag` swatch (components/flag.tsx) to draw. Several languages
   * share a flag — Hindi, Kannada, Telugu, and Malayalam are all `"in"`.
   */
  flagCode: FlagCode;
  /** Pre-formatted for display, e.g. "28.4M learners". */
  learnerCount: string;
  popular?: boolean;
};

export type Unit = {
  id: string;
  languageCode: LanguageCode;
  order: number;
  title: string;
  /** Short playful line shown under the unit title, written in the target language. */
  tagline: string;
  description: string;
  imageUrl?: string;
};

/** Matches the lesson formats described in AGENTS.md's project overview. */
export type LessonType = "chat" | "audio" | "video" | "vocabulary";

export type VocabularyItem = {
  word: string;
  translation: string;
  /** Optional pronunciation guide (e.g. pinyin for Chinese). */
  pronunciation?: string;
};

export type Phrase = {
  phrase: string;
  translation: string;
  pronunciation?: string;
};

export type ActivityType = "multiple-choice" | "translate" | "listen-and-repeat";

export type Activity = {
  id: string;
  type: ActivityType;
  prompt: string;
  /** Present for "multiple-choice" activities. */
  options?: string[];
  correctAnswer: string;
};

export type Lesson = {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  order: number;
  type: LessonType;
  /** Ionicons name, rendered by the UI later (see prompts/11-lesson-ui.md). */
  icon: string;
  title: string;
  subtitle: string;
  goal: string;
  xpReward: number;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  /**
   * Prompt for the audio Vision Agent teacher (prompts/14-vision-agents.md).
   * The teacher speaks mostly English while weaving in target-language
   * vocabulary, translations, and repetition drawn from this lesson.
   */
  aiTeacherPrompt: string;
};
