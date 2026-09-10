import { useClerk } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAuthDestination } from "@/lib/auth-navigation";

/**
 * Placeholder landing spot for signed-in users who haven't picked a language
 * yet. The real picker (and the Zustand store backing "has a language been
 * selected") land in prompts/07-language-ui.md and prompts/08-zustand.md —
 * until then every authenticated user lands here (see lib/auth-navigation.ts).
 */
export default function LanguageSelection() {
  const { signOut } = useClerk();
  const destination = useAuthDestination();

  // Still restoring the session, or no longer the "signed in, no language"
  // case (e.g. signOut() below just ran) — this screen isn't gated by a
  // layout like (auth) is, so without this check signing out would clear
  // the session but leave the user staring at this same screen.
  if (destination === null) return null;
  if (destination !== "/language-selection") return <Redirect href={destination} />;

  return (
    <View className="flex-1 justify-center items-center gap-md px-lg">
      <Text className="h1 text-lingo-purple text-center">Choose your language</Text>
      <Text className="text-text-secondary text-center">
        Language selection is coming soon.
      </Text>
      {/* `replace`, not the default push: "/" is a redirect gate (see
          index.tsx), not a real screen — until a language is actually
          selected it immediately redirects back here. Pushing would leave
          two history entries behind per tap, so the back button would have
          to be pressed twice (once per screen) to leave this loop instead
          of once. */}
      <Link href="/" asChild replace>
        <TouchableOpacity className="mt-lg rounded-lg bg-lingo-purple px-lg py-sm">
          <Text className="text-white font-poppins-semibold">Continue</Text>
        </TouchableOpacity>
      </Link>

      {/* Dev convenience so this stub isn't a dead end — the session
          persists across restarts, so without this there's no way back to
          onboarding / sign-in to test with another account. */}
      <TouchableOpacity className="mt-sm" onPress={() => signOut()}>
        <Text className="text-text-secondary underline">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
