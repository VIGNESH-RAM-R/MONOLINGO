import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

import { getPostAuthHref } from "@/lib/auth-navigation";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to restore the session before deciding — otherwise a
  // signed-in user briefly flashes the sign-in screen on cold start.
  if (!isLoaded) return null;

  // Keep already-signed-in users out of the sign-up/sign-in screens.
  if (isSignedIn) return <Redirect href={getPostAuthHref()} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
