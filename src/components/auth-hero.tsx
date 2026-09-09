import { Image, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { images } from "@/constants/images";
import { colors } from "@/theme";

type AuthHeroProps = {
  title: string;
  subtitle: string;
  bubbleText: string;
};

/**
 * Shared header block for the auth screens (back button, wordmark, headline,
 * mascot + speech bubble) — see prompt_material/03-auth-screen.png. Sign Up
 * and Sign In only differ in copy, which the screens pass in as props.
 */
export function AuthHero({ title, subtitle, bubbleText }: AuthHeroProps) {
  const router = useRouter();

  return (
    <View className="items-center px-lg pt-sm">
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
        hitSlop={12}
        className="self-start"
      >
        <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
      </TouchableOpacity>

      <View className="flex-row items-center gap-xs mt-xs">
        <Image source={images.mascotLogo} className="w-10 h-10" resizeMode="contain" />
        <AppText variant="h3">
          MONO<AppText variant="h3" className="text-lingo-purple">LINGO</AppText>
        </AppText>
      </View>

      <AppText variant="h1" className="text-center mt-md">
        {title}
      </AppText>
      <AppText variant="bodyLarge" className="text-text-secondary text-center mt-xs">
        {subtitle}
      </AppText>

      <View className="w-full items-center mt-md">
        <View className="w-48 h-48 items-center justify-center">
          {/* Speech bubble — italic Poppins stands in for the design's script
              font since no such font asset is loaded (see AGENTS.md's rule
              against adding new libraries/assets without asking first). */}
          <View
            className="absolute z-10 max-w-[130px] rounded-lg bg-lingo-purple/10 px-sm py-xs"
            style={{ top: 4, right: -8 }}
          >
            <AppText variant="h4" className="text-lingo-purple text-center italic">
              {bubbleText}
            </AppText>
          </View>

          <Image source={images.mascotAuth} className="w-48 h-48" resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}
