import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

import { AppText } from "@/components/app-text";
import { images } from "@/constants/images";
import { colors, shadows } from "@/theme";

const CIRCLE_SIZE = 56;
const BAR_HEIGHT = 68;

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Per-tab display config, keyed by route name (the file name under app/(tabs)/). */
type TabConfig =
  | { label: string; icon: IoniconName; activeIcon: IoniconName; mascot?: never }
  | { label: string; mascot: true; icon?: never; activeIcon?: never };

const TAB_CONFIG: Record<string, TabConfig> = {
  index: { label: "Home", icon: "home-outline", activeIcon: "home" },
  learn: { label: "Learn", icon: "book-outline", activeIcon: "book" },
  "ai-teacher": { label: "Mono", mascot: true },
  chat: { label: "Chat", icon: "chatbubble-ellipses-outline", activeIcon: "chatbubble-ellipses" },
  profile: { label: "Profile", icon: "person-outline", activeIcon: "person" },
};

/**
 * Custom bottom tab bar — matches prompt_material/05-home-and-tab-navigation.png.
 *
 * The active tab pops into a purple circle that floats above the bar and
 * shows only its icon; every inactive tab shows icon + label. The circle
 * slides between tabs with a reanimated spring, driven off each tab's
 * measured width so it lines up regardless of screen size.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  const indicatorX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      indicatorX.value = withSpring(state.index * tabWidth, { damping: 16, stiffness: 160 });
    }
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const activeConfig = TAB_CONFIG[state.routes[state.index]?.name ?? ""];

  return (
    <View className="bg-background px-md pt-sm" style={{ paddingBottom: insets.bottom || 12 }}>
      <View
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        className="flex-row rounded-full bg-white px-xs"
        style={[{ height: BAR_HEIGHT }, shadows.raised]}
      >
        {barWidth > 0 && activeConfig && (
          <Animated.View
            pointerEvents="none"
            style={[{ position: "absolute", top: -CIRCLE_SIZE / 2, width: tabWidth, alignItems: "center" }, indicatorStyle]}
          >
            <View
              className="items-center justify-center rounded-full bg-lingo-purple"
              style={[{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }, shadows.raised]}
            >
              {activeConfig.mascot ? (
                <Image
                  source={images.mascotLogo}
                  className="rounded-full"
                  style={{ width: CIRCLE_SIZE * 0.8, height: CIRCLE_SIZE * 0.8 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name={activeConfig.activeIcon} size={26} color="#fff" />
              )}
            </View>
          </Animated.View>
        )}

        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={config.label}
              className="flex-1 items-center justify-center gap-xs"
            >
              {!isFocused &&
                (config.mascot ? (
                  <Image source={images.mascotLogo} className="w-7 h-7 rounded-full" resizeMode="cover" />
                ) : (
                  <Ionicons name={config.icon} size={24} color={colors.textSecondary} />
                ))}
              {!isFocused && (
                <AppText variant="caption" className="text-text-secondary">
                  {config.label}
                </AppText>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
