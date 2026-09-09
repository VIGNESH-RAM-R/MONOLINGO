import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link } from "expo-router";

import { AppText } from "@/components/app-text";
import { AuthHero } from "@/components/auth-hero";
import { JourneyFooter } from "@/components/journey-footer";
import { SocialButton } from "@/components/social-button";
import { TextField } from "@/components/text-field";
import { VerificationModal } from "@/components/verification-modal";
import { shadows } from "@/theme";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationVisible, setVerificationVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <AuthHero
          title="Create your account"
          subtitle="Start your language journey today ✨"
          bubbleText="Let's learn together!"
        />

        <View className="gap-md px-lg mt-lg">
          <TextField
            icon="mail-outline"
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="alex@gmail.com"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextField
            icon="lock-closed-outline"
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity
            activeOpacity={0.85}
            className="flex-row items-center justify-center gap-sm rounded-xl bg-lingo-purple py-md"
            style={shadows.raised}
            onPress={() => setVerificationVisible(true)}
          >
            <AppText variant="h4" className="text-white">
              Sign Up
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

          <SocialButton provider="google" />
          <SocialButton provider="facebook" />
          <SocialButton provider="apple" />

          <View className="flex-row items-center justify-center gap-xs mt-sm">
            <AppText variant="bodyMedium" className="text-text-secondary">
              Already have an account?
            </AppText>
            <Link href="/sign-in" asChild>
              <TouchableOpacity hitSlop={8}>
                <AppText variant="h4" className="text-lingo-purple">
                  Log in
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
        onClose={() => setVerificationVisible(false)}
      />
    </SafeAreaView>
  );
}
