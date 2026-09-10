import type { Language, LanguageCode } from "@/types/learning";

/**
 * The 10 languages the app supports. Only Spanish, French, and Chinese have
 * matching lesson content in units.ts / lessons.ts so far — add units and
 * lessons for the rest here as their content lands.
 *
 * Learner counts and "popular" are hardcoded display data; the ones for
 * Spanish, French, Japanese, Korean, German, and Chinese are sourced from
 * prompt_material/04-language-selection-screen.png, the rest are placeholder
 * estimates in the same spirit.
 */
export const languages: Language[] = [
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flagCode: "fr",
    learnerCount: "19.4M learners",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagCode: "es",
    learnerCount: "28.4M learners",
    popular: true,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flagCode: "de",
    learnerCount: "8.1M learners",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flagCode: "in",
    learnerCount: "6.2M learners",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flagCode: "in",
    learnerCount: "1.8M learners",
  },
  {
    code: "cn",
    name: "Mandarin",
    nativeName: "中文",
    flagCode: "cn",
    learnerCount: "7.4M learners",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagCode: "jp",
    learnerCount: "12.7M learners",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flagCode: "kr",
    learnerCount: "9.3M learners",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flagCode: "in",
    learnerCount: "2.1M learners",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    flagCode: "in",
    learnerCount: "1.6M learners",
  },
];

export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return languages.find((language) => language.code === code);
}
