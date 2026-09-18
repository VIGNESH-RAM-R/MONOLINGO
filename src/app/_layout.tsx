import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Text, View } from "react-native";
import { PostHogErrorBoundary, PostHogProvider, usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { ClerkProvider, useAuth, useClerk, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { posthog } from "@/config/posthog";
import { SELECTED_LANGUAGE_STORAGE_KEY, useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { fontAssets } from "@/theme/fonts";
import "../global.css";

if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file (EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY)");
}

// The guard above only narrows the type inside this `if`, not for the rest of
// the module — the `!` below is safe because we'd have already thrown.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // The language store's persistence is client-only (`skipHydration: true`
  // — see store/language-store.ts for why: reading AsyncStorage during Expo
  // Router's web SSR pass crashes, since there's no `window` in Node). A
  // `useEffect` only ever runs after mounting on the actual client, on every
  // platform, so triggering it here keeps storage access out of any server
  // render entirely.
  useEffect(() => {
    async function hydrateLanguageStore() {
      await Promise.all([useLanguageStore.persist.rehydrate(), useLearningProgressStore.persist.rehydrate()]);

      // Dev-only, and chained *after* the rehydrate above (not a separate
      // effect) so it always wins regardless of effect-ordering: this
      // store persists independently of the Clerk session, so
      // DevAutoSignOut below clearing your login does nothing to a
      // language picked in an earlier test run. Without also clearing this,
      // `getPostAuthHref()` sees that leftover selection and sends a fresh
      // sign-in straight to "/", skipping language-selection entirely.
      if (__DEV__) {
        await AsyncStorage.removeItem(SELECTED_LANGUAGE_STORAGE_KEY);
        useLanguageStore.setState({ selectedLanguage: null });
      }
    }
    hydrateLanguageStore();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const routes = (
    <>
      <DevAutoSignOut />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="language-selection" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
      </Stack>
    </>
  );

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary fallback={PostHogErrorFallback}>
            <PostHogIdentity />
            {routes}
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        routes
      )}
    </ClerkProvider>
  );
}

function PostHogErrorFallback({ error, componentStack }: { error: unknown; componentStack: string }) {
  // TEMPORARY: surfaces the real crash on-device instead of a generic
  // message, so it can be read off a phone where Metro's terminal/LogBox
  // isn't visible. Revert to the plain message once the cause is found.
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 64, backgroundColor: "#fff" }}>
      <Text style={{ fontWeight: "bold", marginBottom: 12 }}>Something went wrong.</Text>
      <Text selectable style={{ marginBottom: 12 }}>
        {error instanceof Error ? `${error.name}: ${error.message}` : String(error)}
      </Text>
      <Text selectable style={{ fontSize: 11, color: "#666" }}>
        {componentStack}
      </Text>
    </View>
  );
}

/**
 * Keeps PostHog's persisted client identity aligned with Clerk's session.
 * Clerk user IDs are immutable account identifiers, unlike profile fields such
 * as an email address. Identifying here means all later client events and
 * exceptions inherit the active user without repeating identity at call sites.
 */
function PostHogIdentity() {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const posthog = usePostHog();
  const identifiedUserId = useRef<string | null>(null);
  const wasSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded) return;

    if (!isSignedIn || !userId) {
      if (wasSignedIn.current !== false) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      wasSignedIn.current = false;
      return;
    }

    wasSignedIn.current = true;
    if (identifiedUserId.current === userId) return;

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(userId, {
      $set: {
        ...(user?.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user?.firstName ? { first_name: user.firstName } : {}),
        ...(user?.lastName ? { last_name: user.lastName } : {}),
      },
    });
    identifiedUserId.current = userId;
  }, [isAuthLoaded, isSignedIn, isUserLoaded, posthog, user, userId]);

  return null;
}

/**
 * Dev-only: signs the user out once, right after Clerk finishes restoring
 * whatever session it had persisted, on every fresh app launch — so during
 * development the app always starts at onboarding instead of wherever a
 * leftover session from earlier testing would otherwise route to (per
 * `useAuthDestination`'s precedence). A real build should keep users signed
 * in across launches like any normal app, hence the `__DEV__` gate.
 *
 * Has to be its own component rendered *inside* <ClerkProvider> — `useAuth`
 * / `useClerk` only work below the provider in the tree, not in the
 * component that renders the provider itself. Renders nothing.
 */
function DevAutoSignOut() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const hasRunForThisLaunch = useRef(false);

  useEffect(() => {
    if (!__DEV__ || !isLoaded || hasRunForThisLaunch.current) return;
    hasRunForThisLaunch.current = true;
    if (isSignedIn) signOut();
  }, [isLoaded, isSignedIn, signOut]);

  return null;
}
