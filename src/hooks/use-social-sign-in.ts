import { useCallback } from "react";
import { Alert, Platform } from "react-native";

// The non-experimental `useSSO` from `@clerk/expo` is the Core 2 version
// (returns a manual `setActive`). This app uses the Core 3 "future" API
// everywhere else (`signIn.password()`, `signUp.finalize()`, ...), so social
// auth uses its Core 3 counterpart too — it activates the session itself.
import { useSSO } from "@clerk/expo/experimental";
import { useRouter } from "expo-router";

import type { SocialProvider } from "@/components/social-button";
import { asHref, getPostAuthHref } from "@/lib/auth-navigation";

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
          router.replace(asHref(getPostAuthHref()));
        }
        // No session → the user cancelled the browser flow, or the provider
        // needs more info before it can finish. Nothing to do here.
      } catch (err) {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        console.error("Social sign-in error:", err);

        // expo-web-browser's Android `openAuthSessionAsync` has no native
        // implementation there — it polyfills via a module-level redirect
        // listener that only clears once the flow settles. If a previous
        // attempt's redirect never made it back to the running JS (a known
        // flaky spot with Android Custom Tabs, worse with a non-Chrome
        // default browser), that listener leaks with no public API to reset
        // it, and every later attempt throws this exact message immediately
        // — only a full JS reload clears it. Surfacing that here beats a
        // silent no-op, since retrying the button does nothing.
        const isStuckWebBrowserSession =
          err instanceof Error && err.message.includes("in an invalid state with a redirect handler set");

        Alert.alert(
          "Sign-in didn't go through",
          isStuckWebBrowserSession
            ? "A previous sign-in attempt didn't finish cleanly. Please reload the app, then try again."
            : "Something went wrong during sign-in. Please try again."
        );
      }
    },
    [startSSOFlow, router]
  );
}
