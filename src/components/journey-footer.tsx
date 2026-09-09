import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

/**
 * Book stack decoration — same "EXPLORE / LEARN / GROW" stack used at the
 * bottom of the onboarding illustration (src/app/onboarding.tsx). Colors are
 * arbitrary values matching the reference art, not theme tokens.
 */
const BOOK_STACK: { label: string; bg: string }[] = [
  { label: "EXPLORE", bg: "bg-[#2F54EB]" },
  { label: "LEARN", bg: "bg-[#E8590C]" },
  { label: "GROW", bg: "bg-[#2F9E44]" },
];

/**
 * Decorative strip at the bottom of the auth screens — a book stack, a
 * globe, and a paper plane on soft purple blobs, matching
 * prompt_material/03-auth-screen.png. Reused by both Sign Up and Sign In.
 */
export function JourneyFooter() {
  return (
    <View className="h-28 overflow-hidden">
      {/* Soft background blobs, clipped by the container above. */}
      <View className="absolute -left-8 -bottom-12 w-40 h-40 rounded-full bg-lingo-purple/10" />
      <View className="absolute -right-10 -bottom-16 w-48 h-48 rounded-full bg-lingo-purple/10" />

      <View
        className="absolute left-lg bottom-md gap-0.5"
        style={{ transform: [{ rotate: "-8deg" }] }}
      >
        {BOOK_STACK.map((book) => (
          <View key={book.label} className={cn("w-16 items-center rounded-sm py-1", book.bg)}>
            <Text className="text-white text-[9px] font-poppins-bold tracking-wide">{book.label}</Text>
          </View>
        ))}
      </View>

      <Text className="absolute right-lg bottom-sm text-[34px]">🌍</Text>
      <Text
        className="absolute right-xl bottom-[72px] text-[20px]"
        style={{ transform: [{ rotate: "25deg" }] }}
      >
        ✈️
      </Text>
    </View>
  );
}
