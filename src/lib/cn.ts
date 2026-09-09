type ClassValue = string | false | null | undefined;

/**
 * Joins conditional className strings, dropping falsy values.
 *
 * Kept dependency-free (no clsx/tailwind-merge) since this app only ever
 * merges a fixed set of NativeWind utility classes — nothing here needs
 * Tailwind-aware conflict resolution.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
