import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

export type FlagCode = "gb" | "es" | "fr" | "cn" | "de" | "in" | "jp" | "kr";

const SIZE = { width: 20, height: 14 };

type FlagProps = {
  code: FlagCode;
  className?: string;
  /** Pixel dimensions of the swatch. Defaults to the small onboarding-bubble size. */
  size?: { width: number; height: number };
};

/**
 * Small flag swatch built from plain Views/Text instead of a flag emoji.
 *
 * Emoji flags are unreliable on Android — regional-indicator sequences like
 * Spain's or China's often render as a blank glyph or a generic placeholder
 * box depending on the device's emoji font. A hand-drawn swatch renders
 * identically on every platform.
 */
export function Flag({ code, className, size = SIZE }: FlagProps) {
  return (
    <View className={cn("overflow-hidden rounded-[2px]", className)} style={size}>
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
      {code === "de" && (
        <View className="flex-1">
          <View className="flex-1 bg-[#000000]" />
          <View className="flex-1 bg-[#DD0000]" />
          <View className="flex-1 bg-[#FFCE00]" />
        </View>
      )}
      {code === "in" && (
        <View className="flex-1">
          <View className="flex-1 bg-[#FF9933]" />
          <View className="flex-1 bg-white items-center justify-center">
            {/* Ashoka Chakra, standing in for the 24-spoke wheel — the glyph
                is the closest single character to it, sized off the swatch's
                own height so it still reads at both the small (onboarding
                bubble) and large (language card) sizes. A dynamic style per
                AGENTS.md's "Dynamic styles" exception. */}
            <Text style={{ color: "#000080", fontSize: size.height * 0.55, lineHeight: size.height * 0.6 }}>
              ☸
            </Text>
          </View>
          <View className="flex-1 bg-[#138808]" />
        </View>
      )}
      {code === "jp" && (
        <View className="flex-1 bg-white items-center justify-center">
          <View className="rounded-full bg-[#BC002D]" style={{ width: "45%", height: "45%" }} />
        </View>
      )}
      {code === "kr" && (
        <View className="flex-1 bg-white items-center justify-center">
          <View className="flex-row overflow-hidden rounded-full" style={{ width: "50%", height: "50%" }}>
            <View className="flex-1 bg-[#CD2E3A]" />
            <View className="flex-1 bg-[#0047A0]" />
          </View>
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
