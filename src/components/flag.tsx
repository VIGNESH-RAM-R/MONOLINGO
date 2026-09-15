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
      {code === "in" && <IndiaFlag height={size.height} />}
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

const CHAKRA_NAVY = "#000080";
/** The real Ashoka Chakra has 24 evenly-spaced spokes. */
const CHAKRA_SPOKE_ANGLES = Array.from({ length: 24 }, (_, i) => i * 15);

/**
 * India's flag — saffron/white/green bands with a full 24-spoke Ashoka
 * Chakra, built the same "plain Views, no glyph" way as the rest of this
 * file (see the doc comment on `Flag` above for why). Shared by Hindi,
 * Kannada, Telugu, and Malayalam, which all use this flag.
 */
function IndiaFlag({ height }: { height: number }) {
  // Sized off the swatch's own height so it still reads at both the small
  // (onboarding-bubble) and large (language-card) sizes — a dynamic style
  // per AGENTS.md's "Dynamic styles" exception.
  const diameter = Math.max(6, height * 0.55);
  const ringWidth = Math.max(1, diameter * 0.08);
  const spokeWidth = Math.max(0.75, diameter * 0.045);
  const hubDiameter = Math.max(1.5, diameter * 0.16);

  return (
    <View className="flex-1">
      <View className="flex-1 bg-[#FF9933]" />
      <View className="flex-1 bg-white items-center justify-center">
        <View style={{ width: diameter, height: diameter }}>
          <View
            className="absolute rounded-full"
            style={{ width: diameter, height: diameter, borderWidth: ringWidth, borderColor: CHAKRA_NAVY }}
          />
          {CHAKRA_SPOKE_ANGLES.map((angle) => (
            <View
              key={angle}
              className="absolute"
              style={{
                width: spokeWidth,
                height: diameter / 2,
                left: diameter / 2 - spokeWidth / 2,
                top: 0,
                backgroundColor: CHAKRA_NAVY,
                transformOrigin: "bottom",
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          ))}
          <View
            className="absolute rounded-full"
            style={{
              width: hubDiameter,
              height: hubDiameter,
              left: diameter / 2 - hubDiameter / 2,
              top: diameter / 2 - hubDiameter / 2,
              backgroundColor: CHAKRA_NAVY,
            }}
          />
        </View>
      </View>
      <View className="flex-1 bg-[#138808]" />
    </View>
  );
}
