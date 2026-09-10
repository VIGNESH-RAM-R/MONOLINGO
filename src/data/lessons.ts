import type { Lesson, LanguageCode, Phrase, VocabularyItem } from "@/types/learning";
import { getLanguageByCode } from "@/data/languages";

/**
 * Builds the system-style prompt for the audio Vision Agent teacher
 * (prompts/14-vision-agents.md) directly from a lesson's own vocabulary and
 * phrases, so every lesson gets a consistent, on-topic prompt without
 * hand-writing near-identical paragraphs for each one.
 */
function buildAiTeacherPrompt(
  languageName: string,
  lesson: { title: string; goal: string; vocabulary: VocabularyItem[]; phrases: Phrase[] },
): string {
  const vocabList = lesson.vocabulary.map((v) => `${v.word} (${v.translation})`).join(", ");
  const phraseList = lesson.phrases.map((p) => `"${p.phrase}" (${p.translation})`).join("; ");

  return (
    `You are Mono, a friendly AI ${languageName} teacher guiding a beginner through the lesson "${lesson.title}". ` +
    `Speak mostly in English, and naturally weave in ${languageName} vocabulary, translations, and repetition to help the learner reach this goal: ${lesson.goal} ` +
    `Introduce and repeat this vocabulary: ${vocabList}. ` +
    `Practice these phrases together: ${phraseList}. ` +
    `Encourage the learner to say each phrase aloud, gently correct their pronunciation, and keep the tone playful and encouraging.`
  );
}

type LessonDraft = Omit<Lesson, "languageCode" | "aiTeacherPrompt"> & { unitId: string };

/**
 * Turns a language-agnostic list of lesson drafts into full `Lesson` objects
 * for one language, filling in `languageCode` and the AI teacher prompt.
 */
function buildLessons(languageCode: LanguageCode, drafts: LessonDraft[]): Lesson[] {
  const language = getLanguageByCode(languageCode);
  if (!language) throw new Error(`Unknown language code: ${languageCode}`);

  return drafts.map((draft) => ({
    ...draft,
    languageCode,
    aiTeacherPrompt: buildAiTeacherPrompt(language.name, draft),
  }));
}

const spanishLessons = buildLessons("es", [
  {
    id: "es-greetings",
    unitId: "es-unit-1",
    order: 1,
    type: "chat",
    icon: "hand-left-outline",
    title: "Greetings & Introductions",
    subtitle: "Say hello, introduce yourself",
    goal: "Learn how to greet people and introduce yourself with confidence.",
    xpReward: 10,
    vocabulary: [
      { word: "hola", translation: "hello" },
      { word: "buenos días", translation: "good morning" },
      { word: "me llamo", translation: "my name is" },
      { word: "mucho gusto", translation: "nice to meet you" },
    ],
    phrases: [
      { phrase: "¿Cómo te llamas?", translation: "What is your name?" },
      { phrase: "Mucho gusto.", translation: "Nice to meet you." },
      { phrase: "¿Cómo estás?", translation: "How are you?" },
    ],
    activities: [
      {
        id: "es-greetings-a1",
        type: "multiple-choice",
        prompt: "How do you say \"hello\" in Spanish?",
        options: ["Hola", "Adiós", "Gracias", "Por favor"],
        correctAnswer: "Hola",
      },
      {
        id: "es-greetings-a2",
        type: "translate",
        prompt: "Translate: \"My name is...\"",
        correctAnswer: "Me llamo...",
      },
    ],
  },
  {
    id: "es-daily-life",
    unitId: "es-unit-1",
    order: 2,
    type: "chat",
    icon: "sunny-outline",
    title: "Daily Life",
    subtitle: "Talk about your routine",
    goal: "Describe your daily routine using simple, everyday sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "trabajo", translation: "work" },
      { word: "despertarse", translation: "to wake up" },
      { word: "desayunar", translation: "to have breakfast" },
      { word: "dormir", translation: "to sleep" },
    ],
    phrases: [
      { phrase: "Me despierto a las siete.", translation: "I wake up at seven." },
      { phrase: "Voy al trabajo.", translation: "I go to work." },
      { phrase: "¿Qué haces normalmente?", translation: "What do you usually do?" },
    ],
    activities: [
      {
        id: "es-daily-life-a1",
        type: "multiple-choice",
        prompt: "What does \"trabajo\" mean?",
        options: ["Work", "Sleep", "Breakfast", "Home"],
        correctAnswer: "Work",
      },
      {
        id: "es-daily-life-a2",
        type: "translate",
        prompt: "Translate: \"I wake up at seven.\"",
        correctAnswer: "Me despierto a las siete.",
      },
    ],
  },
  {
    id: "es-at-the-cafe",
    unitId: "es-unit-1",
    order: 3,
    type: "audio",
    icon: "cafe-outline",
    title: "At the Café",
    subtitle: "Order food and drinks like a local",
    goal: "Learn useful phrases, order like a local, and enjoy real conversations!",
    xpReward: 20,
    vocabulary: [
      { word: "café", translation: "coffee" },
      { word: "agua", translation: "water" },
      { word: "cuenta", translation: "bill" },
      { word: "por favor", translation: "please" },
    ],
    phrases: [
      { phrase: "Quisiera un café, por favor.", translation: "I would like a coffee, please." },
      { phrase: "¿Me trae la cuenta?", translation: "Could you bring me the bill?" },
      { phrase: "¡Está delicioso!", translation: "It's delicious!" },
    ],
    activities: [
      {
        id: "es-at-the-cafe-a1",
        type: "listen-and-repeat",
        prompt: "Repeat: \"Quisiera un café, por favor.\"",
        correctAnswer: "Quisiera un café, por favor.",
      },
      {
        id: "es-at-the-cafe-a2",
        type: "translate",
        prompt: "Translate: \"Could you bring me the bill?\"",
        correctAnswer: "¿Me trae la cuenta?",
      },
    ],
  },
  {
    id: "es-travel-directions",
    unitId: "es-unit-1",
    order: 4,
    type: "chat",
    icon: "navigate-outline",
    title: "Travel & Directions",
    subtitle: "Ask for directions, explore the city",
    goal: "Ask for and understand directions while exploring a new city.",
    xpReward: 15,
    vocabulary: [
      { word: "izquierda", translation: "left" },
      { word: "derecha", translation: "right" },
      { word: "calle", translation: "street" },
      { word: "mapa", translation: "map" },
    ],
    phrases: [
      { phrase: "¿Dónde está la estación?", translation: "Where is the station?" },
      { phrase: "Sigue todo recto.", translation: "Go straight ahead." },
      { phrase: "Gire a la derecha.", translation: "Turn right." },
    ],
    activities: [
      {
        id: "es-travel-directions-a1",
        type: "multiple-choice",
        prompt: "What does \"derecha\" mean?",
        options: ["Right", "Left", "Straight", "Street"],
        correctAnswer: "Right",
      },
      {
        id: "es-travel-directions-a2",
        type: "translate",
        prompt: "Translate: \"Where is the station?\"",
        correctAnswer: "¿Dónde está la estación?",
      },
    ],
  },
  {
    id: "es-shopping",
    unitId: "es-unit-1",
    order: 5,
    type: "vocabulary",
    icon: "bag-outline",
    title: "Shopping",
    subtitle: "Buy things, ask prices",
    goal: "Learn how to shop, ask about prices, and make simple purchases.",
    xpReward: 15,
    vocabulary: [
      { word: "precio", translation: "price" },
      { word: "barato", translation: "cheap" },
      { word: "caro", translation: "expensive" },
      { word: "talla", translation: "size" },
    ],
    phrases: [
      { phrase: "¿Cuánto cuesta esto?", translation: "How much does this cost?" },
      { phrase: "¿Tiene otra talla?", translation: "Do you have another size?" },
      { phrase: "Solo estoy mirando.", translation: "I'm just looking." },
    ],
    activities: [
      {
        id: "es-shopping-a1",
        type: "multiple-choice",
        prompt: "What does \"barato\" mean?",
        options: ["Cheap", "Expensive", "Size", "Price"],
        correctAnswer: "Cheap",
      },
      {
        id: "es-shopping-a2",
        type: "translate",
        prompt: "Translate: \"How much does this cost?\"",
        correctAnswer: "¿Cuánto cuesta esto?",
      },
    ],
  },
  {
    id: "es-family-friends",
    unitId: "es-unit-1",
    order: 6,
    type: "chat",
    icon: "people-outline",
    title: "Family & Friends",
    subtitle: "Talk about the people you care about",
    goal: "Talk about your family and friends in simple sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "familia", translation: "family" },
      { word: "hermano/a", translation: "brother/sister" },
      { word: "amigo/a", translation: "friend" },
      { word: "padres", translation: "parents" },
    ],
    phrases: [
      { phrase: "Esta es mi familia.", translation: "This is my family." },
      { phrase: "Él es mi mejor amigo.", translation: "He is my best friend." },
      { phrase: "Tengo dos hermanos.", translation: "I have two siblings." },
    ],
    activities: [
      {
        id: "es-family-friends-a1",
        type: "multiple-choice",
        prompt: "What does \"amigo\" mean?",
        options: ["Friend", "Family", "Parent", "Sibling"],
        correctAnswer: "Friend",
      },
      {
        id: "es-family-friends-a2",
        type: "translate",
        prompt: "Translate: \"This is my family.\"",
        correctAnswer: "Esta es mi familia.",
      },
    ],
  },
]);

const frenchLessons = buildLessons("fr", [
  {
    id: "fr-greetings",
    unitId: "fr-unit-1",
    order: 1,
    type: "chat",
    icon: "hand-left-outline",
    title: "Greetings & Introductions",
    subtitle: "Say hello, introduce yourself",
    goal: "Learn how to greet people and introduce yourself with confidence.",
    xpReward: 10,
    vocabulary: [
      { word: "bonjour", translation: "hello" },
      { word: "salut", translation: "hi" },
      { word: "je m'appelle", translation: "my name is" },
      { word: "enchanté(e)", translation: "nice to meet you" },
    ],
    phrases: [
      { phrase: "Comment tu t'appelles ?", translation: "What is your name?" },
      { phrase: "Enchanté(e) !", translation: "Nice to meet you!" },
      { phrase: "Ça va bien !", translation: "I'm doing well!" },
    ],
    activities: [
      {
        id: "fr-greetings-a1",
        type: "multiple-choice",
        prompt: "How do you say \"hello\" in French?",
        options: ["Bonjour", "Merci", "Pardon", "Au revoir"],
        correctAnswer: "Bonjour",
      },
      {
        id: "fr-greetings-a2",
        type: "translate",
        prompt: "Translate: \"My name is...\"",
        correctAnswer: "Je m'appelle...",
      },
    ],
  },
  {
    id: "fr-daily-life",
    unitId: "fr-unit-1",
    order: 2,
    type: "chat",
    icon: "sunny-outline",
    title: "Daily Life",
    subtitle: "Talk about your routine",
    goal: "Describe your daily routine using simple, everyday sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "travail", translation: "work" },
      { word: "se réveiller", translation: "to wake up" },
      { word: "petit-déjeuner", translation: "breakfast" },
      { word: "dormir", translation: "to sleep" },
    ],
    phrases: [
      { phrase: "Je me réveille à sept heures.", translation: "I wake up at seven." },
      { phrase: "Je vais au travail.", translation: "I go to work." },
      { phrase: "Qu'est-ce que tu fais d'habitude ?", translation: "What do you usually do?" },
    ],
    activities: [
      {
        id: "fr-daily-life-a1",
        type: "multiple-choice",
        prompt: "What does \"travail\" mean?",
        options: ["Work", "Sleep", "Breakfast", "Home"],
        correctAnswer: "Work",
      },
      {
        id: "fr-daily-life-a2",
        type: "translate",
        prompt: "Translate: \"I wake up at seven.\"",
        correctAnswer: "Je me réveille à sept heures.",
      },
    ],
  },
  {
    id: "fr-at-the-cafe",
    unitId: "fr-unit-1",
    order: 3,
    type: "audio",
    icon: "cafe-outline",
    title: "At the Café",
    subtitle: "Order food and drinks like a local",
    goal: "Learn useful phrases, order like a local, and enjoy real conversations!",
    xpReward: 20,
    vocabulary: [
      { word: "café", translation: "coffee" },
      { word: "eau", translation: "water" },
      { word: "addition", translation: "bill" },
      { word: "s'il vous plaît", translation: "please" },
    ],
    phrases: [
      { phrase: "Je voudrais un café, s'il vous plaît.", translation: "I would like a coffee, please." },
      { phrase: "L'addition, s'il vous plaît.", translation: "The bill, please." },
      { phrase: "C'est délicieux !", translation: "It's delicious!" },
    ],
    activities: [
      {
        id: "fr-at-the-cafe-a1",
        type: "listen-and-repeat",
        prompt: "Repeat: \"Je voudrais un café, s'il vous plaît.\"",
        correctAnswer: "Je voudrais un café, s'il vous plaît.",
      },
      {
        id: "fr-at-the-cafe-a2",
        type: "translate",
        prompt: "Translate: \"The bill, please.\"",
        correctAnswer: "L'addition, s'il vous plaît.",
      },
    ],
  },
  {
    id: "fr-travel-directions",
    unitId: "fr-unit-1",
    order: 4,
    type: "chat",
    icon: "navigate-outline",
    title: "Travel & Directions",
    subtitle: "Ask for directions, explore the city",
    goal: "Ask for and understand directions while exploring a new city.",
    xpReward: 15,
    vocabulary: [
      { word: "gauche", translation: "left" },
      { word: "droite", translation: "right" },
      { word: "rue", translation: "street" },
      { word: "carte", translation: "map" },
    ],
    phrases: [
      { phrase: "Où est la gare ?", translation: "Where is the station?" },
      { phrase: "Continuez tout droit.", translation: "Go straight ahead." },
      { phrase: "Tournez à droite.", translation: "Turn right." },
    ],
    activities: [
      {
        id: "fr-travel-directions-a1",
        type: "multiple-choice",
        prompt: "What does \"droite\" mean?",
        options: ["Right", "Left", "Straight", "Street"],
        correctAnswer: "Right",
      },
      {
        id: "fr-travel-directions-a2",
        type: "translate",
        prompt: "Translate: \"Where is the station?\"",
        correctAnswer: "Où est la gare ?",
      },
    ],
  },
  {
    id: "fr-shopping",
    unitId: "fr-unit-1",
    order: 5,
    type: "vocabulary",
    icon: "bag-outline",
    title: "Shopping",
    subtitle: "Buy things, ask prices",
    goal: "Learn how to shop, ask about prices, and make simple purchases.",
    xpReward: 15,
    vocabulary: [
      { word: "prix", translation: "price" },
      { word: "bon marché", translation: "cheap" },
      { word: "cher", translation: "expensive" },
      { word: "taille", translation: "size" },
    ],
    phrases: [
      { phrase: "Combien ça coûte ?", translation: "How much does this cost?" },
      { phrase: "Avez-vous une autre taille ?", translation: "Do you have another size?" },
      { phrase: "Je regarde seulement.", translation: "I'm just looking." },
    ],
    activities: [
      {
        id: "fr-shopping-a1",
        type: "multiple-choice",
        prompt: "What does \"bon marché\" mean?",
        options: ["Cheap", "Expensive", "Size", "Price"],
        correctAnswer: "Cheap",
      },
      {
        id: "fr-shopping-a2",
        type: "translate",
        prompt: "Translate: \"How much does this cost?\"",
        correctAnswer: "Combien ça coûte ?",
      },
    ],
  },
  {
    id: "fr-family-friends",
    unitId: "fr-unit-1",
    order: 6,
    type: "chat",
    icon: "people-outline",
    title: "Family & Friends",
    subtitle: "Talk about the people you care about",
    goal: "Talk about your family and friends in simple sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "famille", translation: "family" },
      { word: "frère/sœur", translation: "brother/sister" },
      { word: "ami(e)", translation: "friend" },
      { word: "parents", translation: "parents" },
    ],
    phrases: [
      { phrase: "Voici ma famille.", translation: "This is my family." },
      { phrase: "Il est mon meilleur ami.", translation: "He is my best friend." },
      { phrase: "J'ai deux frères et sœurs.", translation: "I have two siblings." },
    ],
    activities: [
      {
        id: "fr-family-friends-a1",
        type: "multiple-choice",
        prompt: "What does \"ami\" mean?",
        options: ["Friend", "Family", "Parent", "Sibling"],
        correctAnswer: "Friend",
      },
      {
        id: "fr-family-friends-a2",
        type: "translate",
        prompt: "Translate: \"This is my family.\"",
        correctAnswer: "Voici ma famille.",
      },
    ],
  },
]);

const chineseLessons = buildLessons("cn", [
  {
    id: "cn-greetings",
    unitId: "cn-unit-1",
    order: 1,
    type: "chat",
    icon: "hand-left-outline",
    title: "Greetings & Introductions",
    subtitle: "Say hello, introduce yourself",
    goal: "Learn how to greet people and introduce yourself with confidence.",
    xpReward: 10,
    vocabulary: [
      { word: "你好", translation: "hello", pronunciation: "nǐ hǎo" },
      { word: "早上好", translation: "good morning", pronunciation: "zǎoshang hǎo" },
      { word: "我叫", translation: "my name is", pronunciation: "wǒ jiào" },
      { word: "很高兴认识你", translation: "nice to meet you", pronunciation: "hěn gāoxìng rènshi nǐ" },
    ],
    phrases: [
      { phrase: "你叫什么名字？", translation: "What is your name?", pronunciation: "Nǐ jiào shénme míngzi?" },
      { phrase: "很高兴认识你。", translation: "Nice to meet you.", pronunciation: "Hěn gāoxìng rènshi nǐ." },
      { phrase: "你好吗？", translation: "How are you?", pronunciation: "Nǐ hǎo ma?" },
    ],
    activities: [
      {
        id: "cn-greetings-a1",
        type: "multiple-choice",
        prompt: "How do you say \"hello\" in Chinese?",
        options: ["你好", "谢谢", "再见", "对不起"],
        correctAnswer: "你好",
      },
      {
        id: "cn-greetings-a2",
        type: "translate",
        prompt: "Translate: \"My name is...\"",
        correctAnswer: "我叫...",
      },
    ],
  },
  {
    id: "cn-daily-life",
    unitId: "cn-unit-1",
    order: 2,
    type: "chat",
    icon: "sunny-outline",
    title: "Daily Life",
    subtitle: "Talk about your routine",
    goal: "Describe your daily routine using simple, everyday sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "工作", translation: "work", pronunciation: "gōngzuò" },
      { word: "起床", translation: "to wake up", pronunciation: "qǐchuáng" },
      { word: "吃早饭", translation: "to have breakfast", pronunciation: "chī zǎofàn" },
      { word: "睡觉", translation: "to sleep", pronunciation: "shuìjiào" },
    ],
    phrases: [
      { phrase: "我七点起床。", translation: "I wake up at seven.", pronunciation: "Wǒ qī diǎn qǐchuáng." },
      { phrase: "我去上班。", translation: "I go to work.", pronunciation: "Wǒ qù shàngbān." },
      { phrase: "你平时做什么？", translation: "What do you usually do?", pronunciation: "Nǐ píngshí zuò shénme?" },
    ],
    activities: [
      {
        id: "cn-daily-life-a1",
        type: "multiple-choice",
        prompt: "What does \"工作\" mean?",
        options: ["Work", "Sleep", "Breakfast", "Home"],
        correctAnswer: "Work",
      },
      {
        id: "cn-daily-life-a2",
        type: "translate",
        prompt: "Translate: \"I wake up at seven.\"",
        correctAnswer: "我七点起床。",
      },
    ],
  },
  {
    id: "cn-at-the-cafe",
    unitId: "cn-unit-1",
    order: 3,
    type: "audio",
    icon: "cafe-outline",
    title: "At the Café",
    subtitle: "Order food and drinks like a local",
    goal: "Learn useful phrases, order like a local, and enjoy real conversations!",
    xpReward: 20,
    vocabulary: [
      { word: "咖啡", translation: "coffee", pronunciation: "kāfēi" },
      { word: "水", translation: "water", pronunciation: "shuǐ" },
      { word: "账单", translation: "bill", pronunciation: "zhàngdān" },
      { word: "请", translation: "please", pronunciation: "qǐng" },
    ],
    phrases: [
      {
        phrase: "请给我一杯咖啡。",
        translation: "I would like a coffee, please.",
        pronunciation: "Qǐng gěi wǒ yì bēi kāfēi.",
      },
      { phrase: "请给我账单。", translation: "Could you bring me the bill?", pronunciation: "Qǐng gěi wǒ zhàngdān." },
      { phrase: "太好吃了！", translation: "It's delicious!", pronunciation: "Tài hǎochī le!" },
    ],
    activities: [
      {
        id: "cn-at-the-cafe-a1",
        type: "listen-and-repeat",
        prompt: "Repeat: \"请给我一杯咖啡。\"",
        correctAnswer: "请给我一杯咖啡。",
      },
      {
        id: "cn-at-the-cafe-a2",
        type: "translate",
        prompt: "Translate: \"Could you bring me the bill?\"",
        correctAnswer: "请给我账单。",
      },
    ],
  },
  {
    id: "cn-travel-directions",
    unitId: "cn-unit-1",
    order: 4,
    type: "chat",
    icon: "navigate-outline",
    title: "Travel & Directions",
    subtitle: "Ask for directions, explore the city",
    goal: "Ask for and understand directions while exploring a new city.",
    xpReward: 15,
    vocabulary: [
      { word: "左边", translation: "left", pronunciation: "zuǒbiān" },
      { word: "右边", translation: "right", pronunciation: "yòubiān" },
      { word: "街道", translation: "street", pronunciation: "jiēdào" },
      { word: "地图", translation: "map", pronunciation: "dìtú" },
    ],
    phrases: [
      { phrase: "车站在哪里？", translation: "Where is the station?", pronunciation: "Chēzhàn zài nǎlǐ?" },
      { phrase: "一直走。", translation: "Go straight ahead.", pronunciation: "Yìzhí zǒu." },
      { phrase: "往右转。", translation: "Turn right.", pronunciation: "Wǎng yòu zhuǎn." },
    ],
    activities: [
      {
        id: "cn-travel-directions-a1",
        type: "multiple-choice",
        prompt: "What does \"右边\" mean?",
        options: ["Right", "Left", "Straight", "Street"],
        correctAnswer: "Right",
      },
      {
        id: "cn-travel-directions-a2",
        type: "translate",
        prompt: "Translate: \"Where is the station?\"",
        correctAnswer: "车站在哪里？",
      },
    ],
  },
  {
    id: "cn-shopping",
    unitId: "cn-unit-1",
    order: 5,
    type: "vocabulary",
    icon: "bag-outline",
    title: "Shopping",
    subtitle: "Buy things, ask prices",
    goal: "Learn how to shop, ask about prices, and make simple purchases.",
    xpReward: 15,
    vocabulary: [
      { word: "价格", translation: "price", pronunciation: "jiàgé" },
      { word: "便宜", translation: "cheap", pronunciation: "piányi" },
      { word: "贵", translation: "expensive", pronunciation: "guì" },
      { word: "尺码", translation: "size", pronunciation: "chǐmǎ" },
    ],
    phrases: [
      { phrase: "这个多少钱？", translation: "How much does this cost?", pronunciation: "Zhège duōshao qián?" },
      { phrase: "有别的尺码吗？", translation: "Do you have another size?", pronunciation: "Yǒu bié de chǐmǎ ma?" },
      { phrase: "我只是看看。", translation: "I'm just looking.", pronunciation: "Wǒ zhǐshì kànkan." },
    ],
    activities: [
      {
        id: "cn-shopping-a1",
        type: "multiple-choice",
        prompt: "What does \"便宜\" mean?",
        options: ["Cheap", "Expensive", "Size", "Price"],
        correctAnswer: "Cheap",
      },
      {
        id: "cn-shopping-a2",
        type: "translate",
        prompt: "Translate: \"How much does this cost?\"",
        correctAnswer: "这个多少钱？",
      },
    ],
  },
  {
    id: "cn-family-friends",
    unitId: "cn-unit-1",
    order: 6,
    type: "chat",
    icon: "people-outline",
    title: "Family & Friends",
    subtitle: "Talk about the people you care about",
    goal: "Talk about your family and friends in simple sentences.",
    xpReward: 10,
    vocabulary: [
      { word: "家人", translation: "family", pronunciation: "jiārén" },
      { word: "兄弟姐妹", translation: "siblings", pronunciation: "xiōngdì jiěmèi" },
      { word: "朋友", translation: "friend", pronunciation: "péngyou" },
      { word: "父母", translation: "parents", pronunciation: "fùmǔ" },
    ],
    phrases: [
      { phrase: "这是我的家人。", translation: "This is my family.", pronunciation: "Zhè shì wǒ de jiārén." },
      {
        phrase: "他是我最好的朋友。",
        translation: "He is my best friend.",
        pronunciation: "Tā shì wǒ zuì hǎo de péngyou.",
      },
      {
        phrase: "我有两个兄弟姐妹。",
        translation: "I have two siblings.",
        pronunciation: "Wǒ yǒu liǎng gè xiōngdì jiěmèi.",
      },
    ],
    activities: [
      {
        id: "cn-family-friends-a1",
        type: "multiple-choice",
        prompt: "What does \"朋友\" mean?",
        options: ["Friend", "Family", "Parent", "Sibling"],
        correctAnswer: "Friend",
      },
      {
        id: "cn-family-friends-a2",
        type: "translate",
        prompt: "Translate: \"This is my family.\"",
        correctAnswer: "这是我的家人。",
      },
    ],
  },
]);

export const lessons: Lesson[] = [...spanishLessons, ...frenchLessons, ...chineseLessons];

export function getLessonsForLanguage(languageCode: LanguageCode): Lesson[] {
  return lessons.filter((lesson) => lesson.languageCode === languageCode).sort((a, b) => a.order - b.order);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.unitId === unitId).sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
