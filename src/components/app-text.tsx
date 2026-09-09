import { Text, type TextProps } from "react-native";

import { cn } from "@/lib/cn";

/**
 * Type ramp from prompt_material/01-design-system.png. Each variant is one
 * combined utility class (size + line-height + weight) defined via
 * `@utility` in global.css — RN can't synthesize font weights on a custom
 * font, so the weight is baked into the class instead of a separate
 * `font-bold`.
 */
const variants = {
  h1: "h1", // Page / Screen Title
  h2: "h2", // Section Title
  h3: "h3", // Card / Module Title
  h4: "h4", // Subheading
  bodyLarge: "body-lg", // Important content
  bodyMedium: "body-md", // Body text
  bodySmall: "body-sm", // Supporting text
  caption: "caption", // Labels, meta text
} as const;

export type AppTextVariant = keyof typeof variants;

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

/**
 * Themed <Text>. Defaults to the `bodyMedium` variant and text-text-primary
 * color; pass a `className` to override color, alignment, etc. — it's merged
 * last so callers can adjust without forking the component.
 *
 *   <AppText variant="h1" className="text-lingo-purple">Title</AppText>
 */
export function AppText({ variant = "bodyMedium", className, ...props }: AppTextProps) {
  return <Text className={cn("text-text-primary", variants[variant], className)} {...props} />;
}
