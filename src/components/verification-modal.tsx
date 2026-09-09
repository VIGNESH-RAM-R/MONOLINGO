import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { cn } from "@/lib/cn";
import { colors, shadows } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
};

/**
 * Bottom-sheet modal for entering the 6-digit email verification code —
 * see prompts/04-authentication-ui.md. This is UI-only for now: it mocks the
 * "code sent" flow and navigates home once all 6 digits are entered. Real
 * Clerk verification wires into this same modal in prompts/05-clerk.md.
 *
 * The visible boxes are just a display — a single invisible TextInput
 * (absolutely positioned, opacity 0) actually receives the number-pad
 * input, which is the standard way to build an OTP field without a
 * per-digit-input focus dance.
 */
export function VerificationModal({ visible, email, onClose }: VerificationModalProps) {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!visible) return;

    // Modal's mount animation needs to finish before the input can take
    // focus, otherwise the keyboard fails to show on iOS.
    const timeout = setTimeout(() => {
      setCode("");
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, [visible]);

  function handleChangeCode(next: string) {
    const digits = next.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digits);

    if (digits.length === CODE_LENGTH) {
      router.replace("/");
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "flex-end" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

        <View className="gap-md rounded-t-2xl bg-white px-lg pt-lg pb-xl" style={shadows.overlay}>
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-md">
              <AppText variant="h3">Verify your email</AppText>
              <AppText variant="bodyMedium" className="text-text-secondary mt-xs">
                We&apos;ve sent a 6-digit code to {email}. Enter it below to continue.
              </AppText>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
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
                  index === code.length ? "border-lingo-purple" : "border-border"
                )}
              >
                <AppText variant="h2">{code[index] ?? ""}</AppText>
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeCode}
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
