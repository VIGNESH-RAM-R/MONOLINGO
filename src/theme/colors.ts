/**
 * Color tokens — mirrors the `--color-*` variables defined in `src/global.css`.
 *
 * Prefer NativeWind className utilities (`bg-mono-orange`, `text-error`, ...)
 * everywhere they work. Import this object only for the StyleSheet-exception
 * cases called out in AGENTS.md (shadows, SafeAreaView, Modal, etc.) where a
 * raw color value is required instead of a className.
 *
 * Source: prompt_material/01-design-system.png
 */
export const colors = {
  // Primary
  monoOrange: "#FF8A00",
  lingoPurple: "#6C4EF5",
  lingoBlue: "#4D8BFF",
  progressGreen: "#21C16B",

  // Semantic
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // Neutrals
  textPrimary: "#0D132B",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
