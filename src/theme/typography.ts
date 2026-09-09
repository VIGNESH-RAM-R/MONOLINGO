/**
 * Typography tokens — mirrors the `@utility` type-ramp classes (h1, h2, h3,
 * h4, body-lg, body-md, body-sm, caption) and `--font-poppins-*` variables
 * defined in `src/global.css`, and the type ramp from prompt_material/01-design-system.png.
 *
 * Prefer the className utilities on screens/components, e.g.:
 *   <Text className="h1">Title</Text>
 *
 * `AppText` (src/components/app-text.tsx) wraps these into a `variant` prop
 * so screens use `<AppText variant="h1">` instead of the raw className.
 *
 * Import this object only for StyleSheet-exception cases (see AGENTS.md).
 */
export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

type TypeStyle = {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
};

function typeStyle(fontSize: number, lineHeightMultiplier: number, family: string): TypeStyle {
  return {
    fontSize,
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    fontFamily: family,
  };
}

export const type = {
  h1: typeStyle(32, 1.2, fontFamily.bold), // Page / Screen Title
  h2: typeStyle(24, 1.3, fontFamily.semibold), // Section Title
  h3: typeStyle(20, 1.3, fontFamily.semibold), // Card / Module Title
  h4: typeStyle(16, 1.4, fontFamily.medium), // Subheading
  bodyLarge: typeStyle(16, 1.6, fontFamily.regular), // Important content
  bodyMedium: typeStyle(14, 1.6, fontFamily.regular), // Body text
  bodySmall: typeStyle(13, 1.6, fontFamily.regular), // Supporting text
  caption: typeStyle(11, 1.4, fontFamily.regular), // Labels, meta text
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof type;
