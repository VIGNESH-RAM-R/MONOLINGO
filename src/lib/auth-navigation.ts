import { useAuth } from "@clerk/expo";
import type { Href } from "expo-router";

import { useLanguageStore } from "@/store/language-store";

/** Every destination the post-auth navigation precedence can land on. */
export type AuthHref = "/onboarding" | "/language-selection" | "/";

/** Where a signed-in user should land, per the navigation precedence in prompts/05-clerk.md. */
export function getPostAuthHref(): AuthHref {
  return useLanguageStore.getState().selectedLanguage ? "/" : "/language-selection";
}

/**
 * Full navigation precedence: unauthenticated → onboarding, authenticated
 * without a language → language-selection, authenticated with one → home.
 * Returns `null` while Clerk is still restoring the session, or while the
 * language store is still loading its persisted value from AsyncStorage.
 */
export function useAuthDestination(): AuthHref | null {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || !hasHydrated) return null;
  if (!isSignedIn) return "/onboarding";
  return selectedLanguage ? "/" : "/language-selection";
}

/**
 * Casts an `AuthHref` to Expo Router's generated `Href`.
 *
 * Home (app/(tabs)/index.tsx, since prompts/09-bottom-tab-nav.md) is a
 * grouped index route — Expo Router still resolves "/" to it correctly at
 * runtime, but its typed-routes generator doesn't always list the bare "/"
 * literal for a grouped index route, so passing an `AuthHref` straight to
 * `router.replace`/`<Redirect>` can fail to typecheck depending on when the
 * dev server last regenerated that file. Route through this instead of
 * changing the actual href string.
 */
export function asHref(href: AuthHref): Href {
  return href as Href;
}
