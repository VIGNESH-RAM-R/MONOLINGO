/**
 * Font asset map, passed to `useFonts()` in the root layout
 * (see src/app/_layout.tsx).
 *
 * Keys must match the `--font-poppins-*` family names used in
 * `src/global.css` exactly, since that's what NativeWind's `font-*`
 * utilities resolve to at render time.
 */
export const fontAssets = {
  "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
} as const;
