/**
 * Spacing tokens — 4px grid, mirrored as `--spacing-*` in `src/global.css`
 * (used via `p-*`, `gap-*`, `m-*` className utilities, e.g. `p-md`, `gap-sm`).
 *
 * Not shown in prompt_material/01-design-system.png (it only covers brand,
 * color and type). These are the standard 4pt-grid steps recommended by the
 * expo-design-system skill — revisit once a screen design calls for a
 * different step.
 *
 * Import this object only for StyleSheet-exception cases (see AGENTS.md).
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;
