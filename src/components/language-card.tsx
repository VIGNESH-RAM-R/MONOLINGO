import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/app-text";
import { Flag } from "@/components/flag";
import { cn } from "@/lib/cn";
import { colors, shadows } from "@/theme";
import type { Language } from "@/types/learning";

const FLAG_SIZE = { width: 44, height: 44 };

type LanguageCardProps = {
  language: Language;
  selected: boolean;
  onPress: () => void;
};

/**
 * One row in the language picker (src/app/language-selection.tsx) — matches
 * prompt_material/04-language-selection-screen.png. A selected card gets a
 * purple border, a tinted background, and a checkmark in place of the
 * chevron; the "Most popular" badge is driven by `language.popular`.
 */
export function LanguageCard({ language, selected, onPress }: LanguageCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-sm rounded-xl border bg-white px-md py-sm",
        selected ? "border-2 border-lingo-purple bg-lingo-purple/5" : "border-border",
      )}
      style={shadows.card}
    >
      <Flag code={language.flagCode} size={FLAG_SIZE} className="rounded-full" />

      <View className="flex-1">
        <AppText variant="h4">{language.name}</AppText>
        <AppText variant="bodySmall" className="text-text-secondary">
          {language.learnerCount}
        </AppText>
      </View>

      {language.popular && (
        <View className="flex-row items-center gap-1 rounded-full bg-mono-orange/10 px-sm py-1">
          <Text className="text-[11px]">🔥</Text>
          <Text className="text-mono-orange text-[11px] font-poppins-semibold">Most popular</Text>
        </View>
      )}

      {selected ? (
        <View className="w-6 h-6 items-center justify-center rounded-full bg-lingo-purple">
          <Ionicons name="checkmark" size={15} color="#fff" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}
