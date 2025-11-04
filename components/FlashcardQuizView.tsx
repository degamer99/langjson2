import React, { useState, useMemo, useEffect } from 'react';
import type { QuizConfig, Book, Flashcard } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';
import { useFlashcardStore } from '../store/useFlashcardStore';

interface FlashcardQuizViewProps {
  config: QuizConfig;
  book: Book;
  onFinish: () => void;
}

const MAX_MASTERY = 5;

const FlashcardQuizView: React.FC<FlashcardQuizViewProps> = ({ config, book, onFinish }) => {
  const { cards, updateCardMastery } = useFlashcardStore();
  const { theme, isRtl, scriptFont } = useSettingsStore();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  
  const sessionWordIds = useMemo(() => {
    const sessionParagraphs = book.chapters
        .flatMap(c => c.paragraphs)
        .filter(p => p.paragraphNumber >= config.startParagraph && p.paragraphNumber <= config.endParagraph);
    return new Set(sessionParagraphs.flatMap(p => p.words.map(w => w.id)));
  }, [book, config]);

  const dueCards = useMemo(() => {
    // Filter cards from the store that are part of this session and not yet mastered
    const sessionCards = cards.filter(c => sessionWordIds.has(c.id));
    const unMasteredCards = sessionCards.filter(c => c.mastery < MAX_MASTERY);

    // Sort by mastery level (lowest first), then by last review date (oldest first)
    return unMasteredCards.sort((a, b) => {
        if (a.mastery !== b.mastery) {
            return a.mastery - b.mastery;
        }
        return (a.lastReviewed || 0) - (b.lastReviewed || 0);
    });
  }, [cards, sessionWordIds]);

  const fontClass = useMemo(() => {
    switch (scriptFont) {
        case 'uthmani': return 'font-uthmani';
        case 'indopak': return 'font-indopak';
        case 'latin-serif': return 'font-latin-serif';
        default: return 'font-sans';
    }
  }, [scriptFont]);

  useEffect(() => {
    // This effect runs when component mounts or when a card is answered (which changes `cards` state, recalculating `dueCards`)
    setCurrentCard(dueCards[0] ?? null);
  }, [dueCards]);

  if (cards.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p>Loading cards...</p>
        </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-3xl font-bold mb-4">🎉<br/>Congratulations!</h2>
        <p className="mb-6">You've mastered all the words in this session!</p>
        <button onClick={onFinish} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold">Back to Reading</button>
      </div>
    );
  }
  
  const totalSessionCards = sessionWordIds.size;
  const masteredSessionCards = cards.filter(c => sessionWordIds.has(c.id) && c.mastery >= MAX_MASTERY).length;
  const progress = totalSessionCards > 0 ? (masteredSessionCards / totalSessionCards) * 100 : 0;

  const isCorrect = userInput.trim().toLowerCase() === currentCard.l1.trim().toLowerCase();

  const handleReveal = () => {
    setIsFlipped(true);
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    updateCardMastery(currentCard.id, rating);
    setIsFlipped(false);
    setUserInput('');
    // The next card will be set by the useEffect hook watching `dueCards`
  };
  
  const bgColor = theme === 'dark' ? 'bg-dark-bg' : theme === 'sepia' ? 'bg-sepia-base' : 'bg-gray-50';
  const cardColor = theme === 'dark' ? 'bg-dark-surface' : theme === 'sepia' ? 'bg-sepia-highlight' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-dark-text' : theme === 'sepia' ? 'text-sepia-text' : 'text-gray-800';
  const inputColor = theme === 'dark' ? 'bg-gray-700 border-gray-600' : theme === 'sepia' ? 'bg-sepia-base border-sepia-muted' : 'bg-gray-100 border-gray-300';
  const revealButtonColor = theme === 'dark' ? 'bg-dark-primary hover:bg-sky-400' : 'bg-blue-500 hover:bg-blue-600';
  
  return (
    <div className={`flex flex-col items-center justify-center h-full p-4 ${bgColor} ${textColor}`}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-4">
          <span className="text-sm opacity-70">Mastered {masteredSessionCards} of {totalSessionCards}</span>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mt-2">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className={`p-8 md:p-12 rounded-xl shadow-lg text-center min-h-[250px] flex flex-col justify-center ${cardColor}`}>
          <p dir={isRtl ? 'rtl' : 'ltr'} className={`text-4xl md:text-5xl font-bold mb-4 ${fontClass}`}>{currentCard.l2}</p>
          {isFlipped && (
            <div className="mt-4">
                <p dir="ltr" className={`text-3xl font-bold p-2 rounded-md ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{currentCard.l1}</p>
                <p className="text-sm opacity-60">Correct Answer</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          {isFlipped ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => handleRating('again')} className="py-3 bg-red-500 text-white rounded-lg font-semibold">Again</button>
                <button onClick={() => handleRating('hard')} className="py-3 bg-orange-500 text-white rounded-lg font-semibold">Hard</button>
                <button onClick={() => handleRating('good')} className="py-3 bg-green-500 text-white rounded-lg font-semibold">Good</button>
                <button onClick={() => handleRating('easy')} className="py-3 bg-blue-500 text-white rounded-lg font-semibold">Easy</button>
             </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                dir="ltr"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type the translation..."
                className={`w-full p-4 text-center text-xl rounded-lg border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${inputColor}`}
              />
              <button onClick={handleReveal} className={`w-full py-3 text-white font-bold rounded-lg transition ${revealButtonColor}`}>
                Reveal Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardQuizView;