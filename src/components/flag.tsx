import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

export type FlagCode = "gb" | "es" | "fr" | "cn";

const SIZE = { width: 20, height: 14 };

type FlagProps = {
  code: FlagCode;
  className?: string;
};

/**
 * Small flag swatch built from plain Views/Text instead of a flag emoji.
 *
 * Emoji flags are unreliable on Android — regional-indicator sequences like
 * Spain's or China's often render as a blank glyph or a generic placeholder
 * box depending on the device's emoji font. A hand-drawn swatch renders
 * identically on every platform.
 */
export function Flag({ code, className }: FlagProps) {
  return (
    <View className={cn("overflow-hidden rounded-[2px]", className)} style={SIZE}>
      {code === "fr" && (
        <View className="flex-1 flex-row">
          <View className="flex-1 bg-[#0055A4]" />
          <View className="flex-1 bg-white" />
          <View className="flex-1 bg-[#EF4135]" />
        </View>
      )}
      {code === "es" && (
        <View className="flex-1">
          <View className="flex-1 bg-[#AA151B]" />
          <View className="flex-[2] bg-[#F1BF00]" />
          <View className="flex-1 bg-[#AA151B]" />
        </View>
      )}
      {code === "cn" && (
        <View className="flex-1 bg-[#DE2910] pl-0.5 pt-0.5">
          <Text className="text-[#FFDE00] text-[7px] leading-[7px]">★</Text>
        </View>
      )}
      {code === "gb" && (
        <View className="flex-1 bg-[#012169] items-center justify-center">
          <View className="absolute bg-white" style={{ width: "100%", height: 4 }} />
          <View className="absolute bg-white" style={{ width: 4, height: "100%" }} />
          <View className="absolute bg-[#C8102E]" style={{ width: "100%", height: 2 }} />
          <View className="absolute bg-[#C8102E]" style={{ width: 2, height: "100%" }} />
        </View>
      )}
    </View>
  );
}
