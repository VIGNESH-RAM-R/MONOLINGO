import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * The AsyncStorage key this store persists to — mirrors the constant/comment
 * pattern in store/language-store.ts.
 */
export const LEARNING_PROGRESS_STORAGE_KEY = "monolingo/learning-progress";

type LearningProgressState = {
  streak: number;
  gems: number;
  dailyXp: number;
  dailyGoalXp: number;
  /** Lesson ids (data/lessons.ts) completed today. */
  completedLessonIds: string[];
  /** Whether the persisted value has finished loading from AsyncStorage. */
  hasHydrated: boolean;
};

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (): LearningProgressState => ({
      // Seeded to match prompt_material/05-home-and-tab-navigation.png —
      // there's no lesson-completion flow yet (that lands with the lesson
      // screen, prompts/11-lesson-ui.md), so Home has nothing real to derive
      // these from yet. Once that flow exists it should update this store's
      // state directly instead of these defaults.
      streak: 12,
      gems: 450,
      dailyXp: 18,
      dailyGoalXp: 25,
      completedLessonIds: [],
      hasHydrated: false,
    }),
    {
      name: LEARNING_PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // hasHydrated is runtime-only bookkeeping, not part of the persisted value.
      partialize: (state) => ({
        streak: state.streak,
        gems: state.gems,
        dailyXp: state.dailyXp,
        dailyGoalXp: state.dailyGoalXp,
        completedLessonIds: state.completedLessonIds,
      }),
      // Same reasoning as store/language-store.ts: rehydration must stay out
      // of Expo Router's web SSR pass, so it's disabled here and triggered
      // manually from a useEffect in the root layout instead.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useLearningProgressStore.setState({ hasHydrated: true });
      },
    },
  ),
);
