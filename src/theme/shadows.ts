import { Platform, type ViewStyle } from "react-native";

/**
 * Shadow tokens. iOS and Android use different shadow APIs, so per
 * AGENTS.md's Style Exception Rules these are plain StyleSheet-compatible
 * objects, not className utilities — spread them into a `style` prop:
 *
 *   <View style={shadows.card}>
 *
 * Not shown in prompt_material/01-design-system.png. These are conservative
 * "soft shadow" defaults matching the brand personality (soft, playful) —
 * revisit once a screen design shows real elevation.
 */
function elevation(offsetY: number, opacity: number, radius: number, elevationValue: number): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation: elevationValue },
    default: {
      shadowColor: "#0D132B",
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  })!;
}

export const shadows = {
  card: elevation(1, 0.05, 2, 2),
  raised: elevation(4, 0.1, 12, 6),
  overlay: elevation(8, 0.18, 24, 12),
} as const;
