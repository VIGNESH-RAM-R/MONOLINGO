/**
 * Border radius tokens, mirrored as `--radius-*` in `src/global.css`
 * (used via `rounded-*` className utilities, e.g. `rounded-md`).
 *
 * Not shown in prompt_material/01-design-system.png. These are sensible
 * defaults for a playful, rounded-card UI — tighten these to match exact
 * pixel values once a screen design shows real card/button radii.
 *
 * Import this object only for StyleSheet-exception cases (see AGENTS.md).
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999, // capsules / pills
} as const;

export type RadiusToken = keyof typeof radius;
