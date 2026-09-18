import type { LanguageCode, Unit } from "@/types/learning";

/**
 * Units group lessons for a language. Each language has one beginner unit
 * for now — add more (with the next `order`) to extend a language's course.
 */
export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Everyday Basics",
    tagline: "¡Pequeñas conversaciones, grandes horizontes!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-es-unit-1/800/600",
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Everyday Basics",
    tagline: "Petites conversations, grands horizons!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-fr-unit-1/800/600",
  },
  {
    id: "cn-unit-1",
    languageCode: "cn",
    order: 1,
    title: "Everyday Basics",
    tagline: "小对话，大视野！",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-cn-unit-1/800/600",
  },
  {
    id: "de-unit-1",
    languageCode: "de",
    order: 1,
    title: "Everyday Basics",
    tagline: "Kleine Gespräche, große Horizonte!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-de-unit-1/800/600",
  },
  {
    id: "hi-unit-1",
    languageCode: "hi",
    order: 1,
    title: "Everyday Basics",
    tagline: "छोटी बातचीत, बड़े क्षितिज!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-hi-unit-1/800/600",
  },
  {
    id: "kn-unit-1",
    languageCode: "kn",
    order: 1,
    title: "Everyday Basics",
    tagline: "ಚಿಕ್ಕ ಸಂಭಾಷಣೆಗಳು, ದೊಡ್ಡ ಪರಿಧಿಗಳು!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-kn-unit-1/800/600",
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Everyday Basics",
    tagline: "小さな会話、大きな地平線！",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-ja-unit-1/800/600",
  },
  {
    id: "ko-unit-1",
    languageCode: "ko",
    order: 1,
    title: "Everyday Basics",
    tagline: "작은 대화, 큰 지평선!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-ko-unit-1/800/600",
  },
  {
    id: "te-unit-1",
    languageCode: "te",
    order: 1,
    title: "Everyday Basics",
    tagline: "చిన్న సంభాషణలు, పెద్ద క్షితిజాలు!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-te-unit-1/800/600",
  },
  {
    id: "ml-unit-1",
    languageCode: "ml",
    order: 1,
    title: "Everyday Basics",
    tagline: "ചെറിയ സംഭാഷണങ്ങൾ, വലിയ ചക്രവാളങ്ങൾ!",
    description:
      "Learn everyday greetings, conversations, and useful phrases to start speaking with confidence.",
    imageUrl: "https://picsum.photos/seed/monolingo-ml-unit-1/800/600",
  },
];

export function getUnitsForLanguage(languageCode: LanguageCode): Unit[] {
  return units.filter((unit) => unit.languageCode === languageCode).sort((a, b) => a.order - b.order);
}

export function getUnitById(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id);
}
