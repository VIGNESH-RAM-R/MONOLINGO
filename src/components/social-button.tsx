import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/app-text";
import { shadows } from "@/theme";

export type SocialProvider = "google" | "facebook" | "apple";

const PROVIDERS: Record<SocialProvider, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  google: { icon: "logo-google", color: "#EA4335", label: "Google" },
  facebook: { icon: "logo-facebook", color: "#1877F2", label: "Facebook" },
  apple: { icon: "logo-apple", color: "#000000", label: "Apple" },
};

type SocialButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

/**
 * "Continue with ..." row from prompt_material/03-auth-screen.png. Reused
 * for Google/Facebook/Apple on both the Sign Up and Sign In screens.
 */
export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const { icon, color, label } = PROVIDERS[provider];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="w-full flex-row items-center justify-center gap-sm rounded-xl border border-border bg-white py-md"
      style={shadows.card}
    >
      <Ionicons name={icon} size={20} color={color} />
      <AppText variant="h4">Continue with {label}</AppText>
    </TouchableOpacity>
  );
}
