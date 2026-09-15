import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageCode } from "@/types/learning";

/**
 * The AsyncStorage key this store persists to. Exported so the dev-only
 * reset control (see prompts/08-zustand.md) can remove exactly this key
 * with `AsyncStorage.removeItem` instead of clearing unrelated storage.
 */
export const SELECTED_LANGUAGE_STORAGE_KEY = "monolingo/selected-language";

type LanguageState = {
  selectedLanguage: LanguageCode | null;
  /** Whether the persisted value has finished loading from AsyncStorage. */
  hasHydrated: boolean;
  setSelectedLanguage: (language: LanguageCode) => void;
  /** Dev-only: clears the in-memory selection so routing can be re-tested. */
  resetSelectedLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      hasHydrated: false,
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      resetSelectedLanguage: () => set({ selectedLanguage: null }),
    }),
    {
      name: SELECTED_LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      // hasHydrated is runtime-only bookkeeping, not part of the persisted value.
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      // Expo Router's web `output: "static"` server-renders every route in
      // Node before it ever reaches a browser — no `window`, which is what
      // AsyncStorage's web shim needs, so an *automatic* rehydration here
      // (which would run the moment this module is imported, during that
      // server render) crashes the whole process. `skipHydration` disables
      // that; `useLanguageStore.persist.rehydrate()` is called instead from
      // a `useEffect` in the root layout, which — on every platform — only
      // ever runs after mounting on the actual client.
      skipHydration: true,
      // Rehydration reads from AsyncStorage, so it always finishes after this
      // module has finished evaluating — `useLanguageStore` is safe to
      // reference here despite being defined by this very call.
      onRehydrateStorage: () => () => {
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
