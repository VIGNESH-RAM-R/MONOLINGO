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
];

export function getUnitsForLanguage(languageCode: LanguageCode): Unit[] {
  return units.filter((unit) => unit.languageCode === languageCode).sort((a, b) => a.order - b.order);
}

export function getUnitById(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id);
}
