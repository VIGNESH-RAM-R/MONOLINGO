import { useMemo, useState } from "react";
import { Image, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { LanguageCard } from "@/components/language-card";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useAuthDestination } from "@/lib/auth-navigation";
import { cn } from "@/lib/cn";
import { colors, shadows } from "@/theme";
import type { LanguageCode } from "@/types/learning";

/**
 * Language picker — matches prompt_material/04-language-selection-screen.png.
 *
 * Selection lives in local state for now; there's no Zustand store yet (see
 * prompts/08-zustand.md), so "Confirm selection" just routes home the same
 * way the earlier stub did. Swap the `useState` below for the real store
 * once it exists.
 */
export default function LanguageSelection() {
  const router = useRouter();
  const destination = useAuthDestination();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LanguageCode | null>(
    languages.find((language) => language.popular)?.code ?? languages[0]?.code ?? null,
  );

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (language) => language.name.toLowerCase().includes(q) || language.nativeName.toLowerCase().includes(q),
    );
  }, [query]);

  // Still restoring the session, or no longer the "signed in, no language"
  // case (e.g. a redirect elsewhere just fired) — this screen isn't gated by
  // a layout like (auth) is, so without this check the destination logic
  // wouldn't otherwise get a chance to run here.
  if (destination === null) return null;
  if (destination !== "/language-selection") return <Redirect href={destination} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="items-center px-lg pt-sm">
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            hitSlop={12}
            className="self-start"
          >
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-xs mt-xs">
            <Image source={images.mascotLogo} className="w-10 h-10" resizeMode="contain" />
            <AppText variant="h3">
              MONO
              <AppText variant="h3" className="text-lingo-purple">
                LINGO
              </AppText>
            </AppText>
          </View>

          <AppText variant="h1" className="text-center mt-md">
            Choose a language
          </AppText>
          <AppText variant="bodyLarge" className="text-text-secondary text-center mt-xs">
            New words. New places. A new you! ✨
          </AppText>
        </View>

        {/* Search */}
        <View className="px-lg mt-lg">
          <View className="flex-row items-center gap-sm rounded-full bg-surface px-md py-sm">
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              className="flex-1 p-0 text-text-primary font-poppins-regular text-base"
              value={query}
              onChangeText={setQuery}
              placeholder="Search languages..."
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              // Dynamic style per AGENTS.md's TextInput exception — zeroes
              // out the platform's default vertical padding so the pill
              // height matches the design instead of growing with it.
              style={{ paddingVertical: 0 }}
            />
          </View>
        </View>

        {/* Popular */}
        <AppText variant="h3" className="px-lg mt-lg mb-sm">
          Popular
        </AppText>

        <View className="gap-sm px-lg">
          {filteredLanguages.map((language) => (
            <LanguageCard
              key={language.code}
              language={language}
              selected={selected === language.code}
              onPress={() => setSelected(language.code)}
            />
          ))}

          {filteredLanguages.length === 0 && (
            <AppText variant="bodyMedium" className="text-text-secondary text-center py-lg">
              No languages match &ldquo;{query}&rdquo;.
            </AppText>
          )}
        </View>

        {/* Illustration — full-bleed to match the design's earth scene. */}
        <Image source={images.earth} className="w-full aspect-[4/3] mt-xl" resizeMode="cover" />
      </ScrollView>

      {/* Confirm — a sticky footer outside the ScrollView, not the last thing
          in it, so it's reachable without scrolling past the whole list and
          the illustration below it. */}
      <View className="border-t border-border bg-white px-lg pt-md pb-md">
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!selected}
          className={cn("w-full items-center rounded-xl py-md", selected ? "bg-lingo-purple" : "bg-border")}
          style={shadows.raised}
          onPress={() => selected && router.replace("/")}
        >
          <AppText variant="h4" className="text-white">
            Confirm selection
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
