import { useCallback } from "react";
import { Alert, Platform } from "react-native";

// The non-experimental `useSSO` from `@clerk/expo` is the Core 2 version
// (returns a manual `setActive`). This app uses the Core 3 "future" API
// everywhere else (`signIn.password()`, `signUp.finalize()`, ...), so social
// auth uses its Core 3 counterpart too — it activates the session itself.
import { useSSO } from "@clerk/expo/experimental";
import { useRouter } from "expo-router";

import type { SocialProvider } from "@/components/social-button";
import { getPostAuthHref } from "@/lib/auth-navigation";

const STRATEGY_BY_PROVIDER: Record<SocialProvider, "oauth_google" | "oauth_facebook" | "oauth_apple"> = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  apple: "oauth_apple",
};

/**
 * Shared "Continue with ..." handler for the Sign Up and Sign In screens.
 * Opens Clerk's browser-based SSO flow (works in Expo Go, no dev build) —
 * Clerk transfers the flow to sign-in or sign-up automatically depending on
 * whether the account already exists, so both screens use this same hook.
 */
export function useSocialSignIn() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  return useCallback(
    async (provider: SocialProvider) => {
      // Apple only issues "Sign in with Apple" credentials to Apple's own
      // ecosystem — restrict the button's action to iOS, per product
      // decision, rather than let it open a flow that isn't meant for
      // other platforms.
      if (provider === "apple" && Platform.OS !== "ios") {
        Alert.alert(
          "Not available on this device",
          "Sign in with Apple only works on iOS. Please use Google or email instead."
        );
        return;
      }

      try {
        const { createdSessionId } = await startSSOFlow({
          strategy: STRATEGY_BY_PROVIDER[provider],
        });

        if (createdSessionId) {
          router.replace(getPostAuthHref());
        }
        // No session → the user cancelled the browser flow, or the provider
        // needs more info before it can finish. Nothing to do here.
      } catch (err) {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        console.error("Social sign-in error:", err);
      }
    },
    [startSSOFlow, router]
  );
}
