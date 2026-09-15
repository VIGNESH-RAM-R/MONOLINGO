import { ActivityIndicator, Text, View } from "react-native";

import { Redirect } from "expo-router";

import { asHref, useAuthDestination } from "@/lib/auth-navigation";
import { colors } from "@/theme";

/**
 * Landing spot for the browser-based SSO redirect (see
 * hooks/use-social-sign-in.ts).
 *
 * In the normal case, this screen never actually renders: `useSSO`'s
 * in-app auth session (`expo-web-browser`'s `openAuthSessionAsync`) is
 * supposed to capture this exact URL itself and close before Expo Router
 * ever navigates here — see `useSSO`'s `redirectUrl` default,
 * `AuthSession.makeRedirectUri({ path: "sso-callback" })`. That capture is a
 * known flaky spot on Android (more so in Expo Go, and more so still with a
 * non-Chrome default browser) — when it fails, the OS opens the redirect as
 * a plain deep link instead, and without a route here Expo Router showed its
 * bare "Unmatched Route" screen. Once Clerk's client catches up, the normal
 * precedence in `useAuthDestination` takes over, same as every other screen
 * that reads it.
 */
export default function SSOCallback() {
  const destination = useAuthDestination();

  if (destination !== null) return <Redirect href={asHref(destination)} />;

  return (
    <View className="flex-1 items-center justify-center gap-md px-lg">
      <ActivityIndicator size="large" color={colors.lingoPurple} />
      <Text className="text-text-secondary text-center">Finishing sign-in…</Text>
    </View>
  );
}
