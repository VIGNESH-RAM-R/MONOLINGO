import { useAuth } from "@clerk/expo";

/** Every destination the post-auth navigation precedence can land on. */
export type AuthHref = "/onboarding" | "/language-selection" | "/";

/**
 * Whether the signed-in user has picked a language yet.
 *
 * There's no language-selection screen or Zustand store yet (see
 * prompts/07-language-ui.md and prompts/08-zustand.md) — until those land,
 * nobody has selected a language, so this always routes through the
 * `/language-selection` placeholder. Replace this with the real store lookup
 * once it exists.
 */
function hasSelectedLanguage(): boolean {
  return false;
}

/** Where a signed-in user should land, per the navigation precedence in prompts/05-clerk.md. */
export function getPostAuthHref(): AuthHref {
  return hasSelectedLanguage() ? "/" : "/language-selection";
}

/**
 * Full navigation precedence: unauthenticated → onboarding, authenticated
 * without a language → language-selection, authenticated with one → home.
 * Returns `null` while Clerk is still restoring the session.
 */
export function useAuthDestination(): AuthHref | null {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return "/onboarding";
  return getPostAuthHref();
}
