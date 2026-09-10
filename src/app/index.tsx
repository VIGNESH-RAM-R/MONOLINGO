import { Text, TouchableOpacity, View } from "react-native";

import { useClerk } from "@clerk/expo";
import { Link, Redirect } from "expo-router";

import { useAuthDestination } from "@/lib/auth-navigation";

export default function Index() {
  const { signOut } = useClerk();
  const destination = useAuthDestination();

  // Still restoring the session from the token cache.
  if (destination === null) return null;

  // Not the fully-authenticated-with-a-language case → bounce to onboarding
  // or the language-selection stub per the precedence in prompts/05-clerk.md.
  if (destination !== "/") return <Redirect href={destination} />;

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="h1 text-lingo-blue">MONOLINGO</Text>
      <Text>LANGUAGE LEARNING APP</Text>
      {/* Real home UI lands in prompts/10-home-ui.md — sign out here for now
          so it's easy to re-test the auth flow from a clean state. */}
      <TouchableOpacity className="mt-lg rounded-lg bg-lingo-purple px-lg py-sm" onPress={() => signOut()}>
        <Text className="text-white font-poppins-semibold">Sign Out</Text>
      </TouchableOpacity>

      {/* Dev convenience: there's no Zustand store yet (prompts/08-zustand.md),
          so nothing actually remembers a picked language — this is the only
          way back to the picker to re-test it until that lands. */}
      <Link href="/language-selection" asChild>
        <TouchableOpacity className="mt-sm">
          <Text className="text-text-secondary underline">Change language</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
