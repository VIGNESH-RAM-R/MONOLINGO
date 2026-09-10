import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";

import { AppText } from "@/components/app-text";
import { AuthHero } from "@/components/auth-hero";
import { JourneyFooter } from "@/components/journey-footer";
import { SocialButton } from "@/components/social-button";
import { TextField } from "@/components/text-field";
import { VerificationModal } from "@/components/verification-modal";
import { useSocialSignIn } from "@/hooks/use-social-sign-in";
import { shadows } from "@/theme";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const signInWithProvider = useSocialSignIn();

  const [email, setEmail] = useState("");
  const [verificationVisible, setVerificationVisible] = useState(false);

  async function handleSignIn() {
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) return; // surfaced via errors.fields below

    setVerificationVisible(true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <AuthHero
          title="Welcome back"
          subtitle="Continue your language journey ✨"
          bubbleText="Missed you!"
        />

        {/* No password field — sign-in is email + code only, same as
            Sign Up's verification step (see prompts/04-authentication-ui.md). */}
        <View className="gap-md px-lg mt-lg">
          <View>
            <TextField
              icon="mail-outline"
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
              autoCorrect={false}
            />
            {errors.fields.identifier && (
              <AppText variant="bodySmall" className="text-error mt-xs">
                {errors.fields.identifier.message}
              </AppText>
            )}
          </View>

          {errors.global?.[0] && (
            <AppText variant="bodySmall" className="text-error">
              {errors.global[0].message}
            </AppText>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center justify-center gap-sm rounded-xl bg-lingo-purple py-md"
            style={shadows.raised}
            onPress={handleSignIn}
            disabled={fetchStatus === "fetching"}
          >
            <AppText variant="h4" className="text-white">
              Sign In
            </AppText>
            <Text className="text-white text-[18px]">→</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-sm">
            <View className="flex-1 h-px bg-border" />
            <AppText variant="bodySmall" className="text-text-secondary">
              or continue with
            </AppText>
            <View className="flex-1 h-px bg-border" />
          </View>

          <SocialButton provider="google" onPress={() => signInWithProvider("google")} />
          <SocialButton provider="facebook" onPress={() => signInWithProvider("facebook")} />
          <SocialButton provider="apple" onPress={() => signInWithProvider("apple")} />

          <View className="flex-row items-center justify-center gap-xs mt-sm">
            <AppText variant="bodyMedium" className="text-text-secondary">
              Don&apos;t have an account?
            </AppText>
            <Link href="/sign-up" asChild>
              <TouchableOpacity hitSlop={8}>
                <AppText variant="h4" className="text-lingo-purple">
                  Sign up
                </AppText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <JourneyFooter />
      </ScrollView>

      <VerificationModal
        visible={verificationVisible}
        email={email || "your email"}
        mode="sign-in"
        onClose={() => setVerificationVisible(false)}
      />
    </SafeAreaView>
  );
}
