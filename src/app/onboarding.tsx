import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { Flag, type FlagCode } from "@/components/flag";
import { images } from "@/constants/images";
import { cn } from "@/lib/cn";
import { shadows } from "@/theme";

/**
 * Greeting bubbles floating around the mascot. Position is percentage-based
 * (relative to the illustration container) so it holds up across screen
 * sizes — a "dynamic style" per AGENTS.md, hence the inline `style` instead
 * of a className.
 *
 * Positions stay within [0%, 100%] on purpose: the illustration container
 * below is full-bleed (no horizontal padding), so bubbles can sit right at
 * the screen edge without ever needing a negative offset. A negative offset
 * pushes a view outside its parent's bounds, and Android clips that by
 * default — that was the "text getting cut in half" bug.
 */
const GREETING_BUBBLES: {
  code: FlagCode;
  text: string;
  bg: string;
  color: string;
  style: { top: `${number}%`; left?: `${number}%`; right?: `${number}%` };
}[] = [
  { code: "gb", text: "Hello!", bg: "bg-lingo-blue/10", color: "text-lingo-blue", style: { top: "2%", left: "2%" } },
  { code: "es", text: "¡Hola!", bg: "bg-lingo-purple/10", color: "text-lingo-purple", style: { top: "2%", right: "2%" } },
  { code: "fr", text: "Bonjour!", bg: "bg-progress-green/10", color: "text-progress-green", style: { top: "24%", left: "0%" } },
  { code: "cn", text: "你好!", bg: "bg-error/10", color: "text-error", style: { top: "30%", right: "0%" } },
];

/**
 * Book stack decoration, bottom-right of the illustration — colors are
 * arbitrary values (not theme tokens) picked to match the reference
 * illustration's book covers rather than the app's semantic palette.
 */
const BOOK_STACK: { label: string; bg: string }[] = [
  { label: "EXPLORE", bg: "bg-[#2F54EB]" },
  { label: "LEARN", bg: "bg-[#E8590C]" },
  { label: "GROW", bg: "bg-[#2F9E44]" },
];

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1">
        {/* Logo */}
        <View className="items-center pt-sm px-lg">
          <View className="flex-row items-center gap-xs">
            <Image source={images.mascotLogo} className="w-12 h-12" resizeMode="contain" />
            {/* h2 is the closest ramp size to the design's wordmark — the
                variant stays untouched, only its color is overridden, which
                is exactly what AppText's contract supports. */}
            <AppText variant="h2">
              MONO<AppText variant="h2" className="text-lingo-purple">LINGO</AppText>
            </AppText>
          </View>

          {/* Headline */}
          <AppText variant="h1" className="text-center mt-lg">
            Your AI language
          </AppText>
          <View className="flex-row items-start">
            <AppText variant="h1" className="text-lingo-purple">
              teacher.
            </AppText>
            <Text className="text-mono-orange text-[18px] mt-xs ml-xs">✦</Text>
          </View>

          <AppText variant="bodyLarge" className="text-text-secondary text-center mt-sm">
            Real conversations, personalized lessons, anytime, anywhere.
          </AppText>
        </View>

        {/* Illustration — deliberately full-bleed (no px-lg) so the bubbles
            below can touch the screen edge without a negative offset. */}
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center justify-center">
            {/* Background leaves, sitting behind everything else — rendered
                first so later siblings paint on top of them. */}
            <Text className="absolute text-[30px]" style={{ bottom: "0%", left: "0%" }}>
              🌿
            </Text>
            <Text className="absolute text-[30px]" style={{ bottom: "0%", right: "0%" }}>
              🌿
            </Text>

            {GREETING_BUBBLES.map((bubble) => (
              <View
                key={bubble.text}
                className={cn("absolute flex-row items-center gap-xs rounded-lg px-md py-sm", bubble.bg)}
                style={bubble.style}
              >
                <Flag code={bubble.code} />
                <AppText variant="h4" className={bubble.color}>
                  {bubble.text}
                </AppText>
              </View>
            ))}

            {/* Small sparkle accents echoing the design's playful bursts. */}
            <Text className="absolute text-mono-orange text-[14px]" style={{ top: "13%", left: "8%" }}>
              ✦
            </Text>
            <Text className="absolute text-mono-orange text-[14px]" style={{ top: "35%", left: "4%" }}>
              ✦
            </Text>
            <Text className="absolute text-mono-orange text-[16px]" style={{ top: "18%", right: "20%" }}>
              ✦
            </Text>

            <Text className="absolute text-[32px]" style={{ bottom: "8%", left: "2%" }}>
              🌍
            </Text>

            {/* Book stack — matches the "EXPLORE / LEARN / GROW" stack in the
                reference design. Rotation is a transform array, a StyleSheet
                exception per AGENTS.md; colors/spacing stay className. */}
            <View
              className="absolute gap-0.5"
              style={{ bottom: "6%", right: "2%", transform: [{ rotate: "-8deg" }] }}
            >
              {BOOK_STACK.map((book) => (
                <View key={book.label} className={cn("w-16 items-center rounded-sm py-1", book.bg)}>
                  <Text className="text-white text-[9px] font-poppins-bold tracking-wide">{book.label}</Text>
                </View>
              ))}
            </View>
            <Text className="absolute text-[22px]" style={{ top: "48%", right: "6%" }}>
              ✈️
            </Text>

            <Image source={images.mascotWelcome} className="w-64 h-64" resizeMode="contain" />
          </View>
        </View>

        {/* Call to action */}
        <View className="items-center gap-md pb-lg px-lg">
          <TouchableOpacity
            activeOpacity={0.85}
            className="w-full flex-row items-center justify-center gap-sm rounded-xl bg-lingo-purple py-md"
            style={shadows.raised}
            onPress={() => router.push("/sign-up")}
          >
            <AppText variant="h4" className="text-white">
              Get Started
            </AppText>
            <Text className="text-white text-[18px]">›</Text>
          </TouchableOpacity>

          <AppText variant="bodySmall" className="text-text-secondary text-center">
            A more open world, one language at a time.
          </AppText>

          {/* Small curved underline flourish — clipped bottom-half circle,
              positioning is a runtime shape (not a Tailwind concept), so it
              stays inline per AGENTS.md's "Dynamic styles" exception. */}
          <View style={{ width: 56, height: 6, overflow: "hidden" }}>
            <View
              className="border-lingo-purple"
              style={{ position: "absolute", top: -50, width: 56, height: 56, borderRadius: 28, borderWidth: 2 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
