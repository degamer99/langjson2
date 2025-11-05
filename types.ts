export interface Word {
  id: string;
  l2: string; // Target language (e.g., Arabic)
  l1: string; // Native language (e.g., English)
  pronunciation?: string;
}

export interface Flashcard extends Word {
  mastery: number;
  lastReviewed: number | null;
}

export interface Paragraph {
  id: string;
  paragraphNumber: number;
  words: Word[];
  translationL1: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  languageCode: string; // e.g., 'ar'
  chapters: {
    number: number;
    title: string;
    paragraphs: Paragraph[];
  }[];
}

export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'sm' | 'base' | 'lg';
export type ScriptFont = 'uthmani' | 'indopak' | 'latin-serif';
export type Style = 'madani' | 'tajweed'; // Example styles
// export type View = 'reading' | 'quizConfig' | 'quiz' | 'import';
export type View = 'reading' | 'quizConfig' | 'quiz' | 'import' | 'importTxt';

export interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
  showWordByWord: boolean;
  translationLanguage: string;
  scriptFont: ScriptFont;
  isRtl: boolean;

  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  toggleWordByWord: () => void;
  setTranslationLanguage: (lang: string) => void;
  setScriptFont: (font: ScriptFont) => void;
  toggleRtl: () => void;
}

export interface QuizConfig {
  quizType: 'Vocabulary';
  startParagraph: number;
  endParagraph: number;
}

export interface FlashcardState {
  cards: Flashcard[];
  initializeDeck: (words: Word[]) => void;
  updateCardMastery: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  resetProgress: () => void;
}
