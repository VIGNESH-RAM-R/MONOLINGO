import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View } from "react-native";

import { useClerk } from "@clerk/expo";
import { Redirect } from "expo-router";

import { Flag } from "@/components/flag";
import { getLanguageByCode } from "@/data/languages";
import { asHref, useAuthDestination } from "@/lib/auth-navigation";
import { SELECTED_LANGUAGE_STORAGE_KEY, useLanguageStore } from "@/store/language-store";

const FLAG_SIZE = { width: 28, height: 28 };

export default function Index() {
  const { signOut } = useClerk();
  const destination = useAuthDestination();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const resetSelectedLanguage = useLanguageStore((state) => state.resetSelectedLanguage);

  // Still restoring the session from the token cache.
  if (destination === null) return null;

  // Not the fully-authenticated-with-a-language case → bounce to onboarding
  // or language-selection per the precedence in prompts/05-clerk.md.
  if (destination !== "/") return <Redirect href={asHref(destination)} />;

  // Guaranteed non-null by the precedence above (this route only resolves to
  // "/" once a language is selected) — `getLanguageByCode` still guards
  // against a persisted code no longer existing in `data/languages.ts`.
  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="h1 text-lingo-blue">MONOLINGO</Text>
      <Text>LANGUAGE LEARNING APP</Text>

      {/* Real home UI lands in prompts/10-home-ui.md — this just proves the
          selection made it through the store, same spirit as the rest of
          this stub. */}
      {language && (
        <View className="flex-row items-center gap-sm mt-md">
          <Flag code={language.flagCode} size={FLAG_SIZE} className="rounded-full" />
          <Text className="text-lg font-poppins-semibold text-text-primary">Learning {language.name}</Text>
        </View>
      )}

      {/* Real home UI lands in prompts/10-home-ui.md — sign out here for now
          so it's easy to re-test the auth flow from a clean state. */}
      <TouchableOpacity className="mt-lg rounded-lg bg-lingo-purple px-lg py-sm" onPress={() => signOut()}>
        <Text className="text-white font-poppins-semibold">Sign Out</Text>
      </TouchableOpacity>

      {/* Dev-only: once a language is selected, visiting /language-selection
          just redirects back here (see useAuthDestination), so this is how
          the language-selection routing gets re-tested during development. */}
      {(__DEV__ || process.env.NODE_ENV === "test") && (
        <TouchableOpacity
          className="mt-sm"
          onPress={async () => {
            await AsyncStorage.removeItem(SELECTED_LANGUAGE_STORAGE_KEY);
            resetSelectedLanguage();
          }}
        >
          <Text className="text-text-secondary underline">Reset selected language (dev)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
