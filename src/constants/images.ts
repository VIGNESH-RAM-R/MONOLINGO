/**
 * Centralized image imports — see AGENTS.md "Image Rule".
 *
 * Never `require`/import an asset directly inside a screen or component;
 * import it from here instead.
 */

export const images = {
  // Filename keeps the "moscot" typo from the asset source — the export key
  // below is spelled correctly. `require()` matches the convention already
  // used for font assets in src/theme/fonts.ts.
  mascotLogo: require("@/assets/assets/images/moscot-logo.png"),
  mascotWelcome: require("@/assets/assets/images/mascot-welcome.png"),
  mascotAuth: require("@/assets/assets/images/mascot-auth.png"),
  earth: require("@/assets/assets/images/earth.png"),
};
