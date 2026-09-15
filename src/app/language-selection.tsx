import { useMemo, useState } from "react";
import { Image, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useClerk } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";

import { AppText } from "@/components/app-text";
import { LanguageCard } from "@/components/language-card";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { asHref, useAuthDestination } from "@/lib/auth-navigation";
import { cn } from "@/lib/cn";
import { useLanguageStore } from "@/store/language-store";
import { colors, shadows } from "@/theme";
import type { LanguageCode } from "@/types/learning";

// Natural pixel size of assets/assets/images/earth.png and mascot-welcome.png
// — used to size the illustration so `resizeMode="cover"`/`"contain"` never
// have to guess at an aspect ratio (see ExploreIllustration below).
const EARTH_ASPECT_RATIO = 1448 / 1086;
const MASCOT_ASPECT_RATIO = 915 / 1044;

/**
 * Language picker — matches prompt_material/04-language-selection-screen.png.
 *
 * The highlighted card is local UI state (so a language is pre-selected
 * before the user taps anything); "Confirm selection" is what actually
 * commits it to the Zustand store, which is what the routing precedence
 * above and in `useAuthDestination` reads from.
 */
export default function LanguageSelection() {
  const router = useRouter();
  const { signOut } = useClerk();
  const destination = useAuthDestination();
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);

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
  if (destination !== "/language-selection") return <Redirect href={asHref(destination)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="items-center px-lg pt-sm">
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace(asHref("/")))}
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

          {/* Dev-only: this screen only shows up for a signed-in user, so
              without this there's no way back to onboarding/sign-in to
              re-test the auth flow without first finishing language
              selection just to reach the Sign Out button on the home stub. */}
          {__DEV__ && (
            <TouchableOpacity className="mt-xs" onPress={() => signOut()} hitSlop={8}>
              <AppText variant="caption" className="text-text-secondary underline">
                Sign out (dev)
              </AppText>
            </TouchableOpacity>
          )}
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

        <ExploreIllustration />
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
          onPress={() => {
            if (!selected) return;
            setSelectedLanguage(selected);
            router.replace(asHref("/"));
          }}
        >
          <AppText variant="h4" className="text-white">
            Confirm selection
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * "Explore the world" scene at the bottom of the language picker — matches
 * prompt_material/04-language-selection-screen.png. The reference is one
 * hand-illustrated piece (globe + mascot holding a flag + a signpost), but
 * assets/assets/images/earth.png only has the globe and landmarks — so this
 * composites the mascot and a recreated flag/signpost on top of it instead
 * of requiring a new matching illustration asset. Sizes come from the
 * screen width and each image's natural aspect ratio (the constants above)
 * so nothing crops or stretches; the mascot/flag/signpost offsets below are
 * eyeballed against the reference rather than measured, since the two
 * illustrations don't share a pixel grid.
 */
function ExploreIllustration() {
  const { width } = useWindowDimensions();
  const earthHeight = width / EARTH_ASPECT_RATIO;
  const mascotWidth = width * 0.36;
  const mascotHeight = mascotWidth / MASCOT_ASPECT_RATIO;

  const signpostTags = [
    { label: "New Languages", color: "#C08B4E" },
    { label: "New Cultures", color: colors.lingoBlue },
    { label: "A Brighter You", color: colors.success },
  ];

  return (
    <View className="mt-xl" style={{ width, height: earthHeight }}>
      <Image source={images.earth} style={{ width, height: earthHeight }} resizeMode="cover" />

      {/* Signpost — bottom-left, standing at the globe's grass line. */}
      <View style={{ position: "absolute", left: width * 0.06, bottom: earthHeight * 0.14 }}>
        <View className="gap-1">
          {signpostTags.map((tag) => (
            <SignpostTag key={tag.label} label={tag.label} color={tag.color} />
          ))}
        </View>
        <View className="bg-[#8B5E34]" style={{ width: 4, height: 32, marginLeft: 16 }} />
      </View>

      {/* Mascot + flag — bottom-center, standing at the globe's grass line. */}
      <View
        style={{
          position: "absolute",
          left: width * 0.5 - mascotWidth / 2,
          bottom: earthHeight * 0.1,
          width: mascotWidth,
          alignItems: "center",
        }}
      >
        <View
          style={{ position: "absolute", top: -mascotHeight * 0.3, right: -mascotWidth * 0.25, alignItems: "flex-end" }}
        >
          <View className="rounded-lg bg-lingo-purple px-sm py-xs" style={shadows.card}>
            <AppText variant="caption" className="text-white font-poppins-bold text-center leading-4">
              EXPLORE{"\n"}LEARN{"\n"}GROW
            </AppText>
          </View>
          <AppText variant="caption" className="text-lingo-purple italic text-right mt-1">
            A more open{"\n"}world awaits!
          </AppText>
        </View>

        <Image
          source={images.mascotWelcome}
          style={{ width: mascotWidth, height: mascotHeight }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

/** One arrow-shaped tag in the ExploreIllustration signpost — a rounded-left
 *  rectangle with a CSS-triangle point standing in for the design's arrow
 *  sign, since NativeWind has no utility for a custom polygon shape. */
function SignpostTag({ label, color }: { label: string; color: string }) {
  return (
    <View className="flex-row items-center">
      <View className="rounded-l-md px-sm items-center justify-center" style={{ backgroundColor: color, height: 26 }}>
        <AppText variant="caption" className="text-white font-poppins-semibold" numberOfLines={1}>
          {label}
        </AppText>
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: 13,
          borderBottomWidth: 13,
          borderLeftWidth: 9,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: color,
        }}
      />
    </View>
  );
}
