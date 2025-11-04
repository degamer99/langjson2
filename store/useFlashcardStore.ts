import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Word, Flashcard, FlashcardState } from '../types';

const MAX_MASTERY = 5;

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      cards: [],
      initializeDeck: (words: Word[]) => {
        // const existingCards = get().cards;
        // const existingCardIds = new Set(existingCards.map(c => c.id));

        // // Only add new words, don't overwrite existing progress
        // const newWords = words.filter(w => !existingCardIds.has(w.id));

        // if (newWords.length > 0) {
        //     const newCards: Flashcard[] = newWords.map(word => ({
        //         ...word,
        //         mastery: 0,
        //         lastReviewed: null,
        //     }));

        //     set({ cards: [...existingCards, ...newCards] });
        // }
        //
        // ^^^ THE OLD LOGIC (ABOVE) WAS THE BUG.
        // It added new words but never removed old ones.

        // ---

        // NEW, FIXED LOGIC:
        // This function is called by App.tsx whenever the 'book' state changes.
        // We must *replace* the entire deck with the words from the new book
        // to remove the old book's words.
        const newCards: Flashcard[] = words.map(word => ({
          ...word,
          mastery: 0,
          lastReviewed: null,
        }));

        // This 'set' call replaces the entire 'cards' array.
        set({ cards: newCards });
      },
      updateCardMastery: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
        set(state => {
          const cardToUpdate = state.cards.find(c => c.id === cardId);
          if (!cardToUpdate) return state;

          let newMastery = cardToUpdate.mastery;
          switch (rating) {
            case 'again':
              newMastery = 0;
              break;
            case 'hard':
              newMastery = 1;
              break;
            case 'good':
              newMastery = Math.min(newMastery + 1, MAX_MASTERY);
              break;
            case 'easy':
              newMastery = Math.min(newMastery + 2, MAX_MASTERY);
              break;
          }

          const updatedCards = state.cards.map(card =>
            card.id === cardId
              ? { ...card, mastery: newMastery, lastReviewed: Date.now() }
              : card
          );

          return { cards: updatedCards };
        });
      },
      resetProgress: () => {
        set(state => ({
          cards: state.cards.map(card => ({
            ...card,
            mastery: 0,
            lastReviewed: null,
          }))
        }));
      }
    }),
    {
      name: 'langjson-flashcard-storage',
    }
  )
);
