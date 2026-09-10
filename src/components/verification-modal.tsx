import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSignIn, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { cn } from "@/lib/cn";
import { type AuthHref, getPostAuthHref } from "@/lib/auth-navigation";
import { colors, shadows } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  /** Which Clerk attempt this code verifies — sign-up uses email/password + a
   *  code, sign-in here is email + code only (see the screens for why). */
  mode: "sign-up" | "sign-in";
  onClose: () => void;
};

/**
 * Bottom-sheet modal for entering the 6-digit email verification code —
 * see prompts/04-authentication-ui.md. Wired to real Clerk verification in
 * prompts/05-clerk.md: the screen sends the code before opening this modal,
 * and this modal verifies it and finalizes the sign-up/sign-in, navigating
 * home only once Clerk confirms success.
 *
 * The visible boxes are just a display — a single invisible TextInput
 * (absolutely positioned, opacity 0) actually receives the number-pad
 * input, which is the standard way to build an OTP field without a
 * per-digit-input focus dance.
 */
export function VerificationModal({ visible, email, mode, onClose }: VerificationModalProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  useEffect(() => {
    if (!visible) return;

    // Modal's mount animation needs to finish before the input can take
    // focus, otherwise the keyboard fails to show on iOS.
    const timeout = setTimeout(() => {
      setCode("");
      setError(null);
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, [visible]);

  // Decorates the destination for Safari's Intelligent Tracking Prevention
  // (relevant on Expo web) and navigates. See the `finalize()` docs:
  // https://clerk.com/docs/reference/objects/sign-in-future#finalize
  function goTo(decorateUrl: (url: string) => string, href: AuthHref) {
    const url = decorateUrl(href);
    if (url.startsWith("http")) {
      // decorateUrl returned an absolute URL for Safari ITP — the plain
      // `href` above is no longer enough, this exact URL must be visited.
      if (typeof window !== "undefined") window.location.href = url;
    } else {
      router.replace(href);
    }
  }

  async function handleChangeCode(next: string) {
    const digits = next.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    setError(null);

    if (digits.length !== CODE_LENGTH) return;

    setVerifying(true);
    try {
      if (mode === "sign-up") {
        const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code: digits });
        if (verifyError) {
          setError("That code didn't work. Please try again.");
          setCode("");
          return;
        }
        if (signUp.status === "complete") {
          // Session tasks (e.g. forced MFA enrollment) aren't built yet —
          // fall back to home rather than leaving the user stuck on nothing.
          await signUp.finalize({
            navigate: ({ session, decorateUrl }) =>
              goTo(decorateUrl, session.currentTask ? "/" : getPostAuthHref()),
          });
        }
      } else {
        const { error: verifyError } = await signIn.emailCode.verifyCode({ code: digits });
        if (verifyError) {
          setError("That code didn't work. Please try again.");
          setCode("");
          return;
        }
        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ session, decorateUrl }) =>
              goTo(decorateUrl, session.currentTask ? "/" : getPostAuthHref()),
          });
        }
      }
    } finally {
      setVerifying(false);
    }
  }

  function handleClose() {
    if (mode === "sign-up") {
      signUp.reset();
    } else {
      signIn.reset();
    }
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "flex-end" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable className="absolute inset-0 bg-black/40" onPress={handleClose} />

        <View className="gap-md rounded-t-2xl bg-white px-lg pt-lg pb-xl" style={shadows.overlay}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-md">
              <AppText variant="h3">Verify your email</AppText>
              <AppText variant="bodyMedium" className="text-text-secondary mt-xs">
                We&apos;ve sent a 6-digit code to {email}. Enter it below to continue.
              </AppText>
            </View>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Pressable
            className="flex-row justify-between"
            onPress={() => inputRef.current?.focus()}
            accessible={false}
          >
            {Array.from({ length: CODE_LENGTH }).map((_, index) => (
              <View
                key={index}
                accessible={false}
                className={cn(
                  "w-12 h-14 items-center justify-center rounded-xl border-2 bg-surface",
                  error ? "border-error" : index === code.length ? "border-lingo-purple" : "border-border"
                )}
              >
                <AppText variant="h2">{code[index] ?? ""}</AppText>
              </View>
            ))}
          </Pressable>

          {error && (
            <AppText variant="bodySmall" className="text-error">
              {error}
            </AppText>
          )}

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeCode}
            editable={!verifying}
            accessibilityLabel="6-digit verification code"
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            // Invisible on purpose — see file doc comment above.
            style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
