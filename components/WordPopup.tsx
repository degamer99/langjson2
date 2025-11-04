import React from 'react';
import type { Word } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';
import { FlashcardIcon, XIcon } from './icons/IconComponents';

interface WordPopupProps {
  word: Word;
  position: { top: number; left: number };
  onClose: () => void;
  onAddToFlashcards: () => void;
}

const WordPopup: React.FC<WordPopupProps> = ({ word, position, onClose, onAddToFlashcards }) => {
  const { theme, isRtl } = useSettingsStore();
  const bgColor = theme === 'dark' ? 'bg-dark-surface' : theme === 'sepia' ? 'bg-sepia-highlight' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-dark-text' : theme === 'sepia' ? 'text-sepia-text' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : theme === 'sepia' ? 'border-sepia-muted' : 'border-gray-200';
  const btnColor = theme === 'dark' ? 'bg-dark-primary/20 text-dark-primary hover:bg-dark-primary/40' : theme === 'sepia' ? 'bg-amber-600/20 text-amber-800 hover:bg-amber-600/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200';

  return (
    <div
      className={`word-popup absolute z-10 w-64 rounded-xl shadow-2xl border transform -translate-x-1/2 ${bgColor} ${textColor} ${borderColor}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 dir={isRtl ? 'rtl' : 'ltr'} className="text-2xl font-bold font-uthmani">{word.l2}</h3>
                <p className="text-lg">{word.l1}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/10">
                <XIcon />
            </button>
        </div>
        {word.pronunciation && (
          <p className="mb-3 text-sm italic opacity-70">[{word.pronunciation}]</p>
        )}
        <div className="border-t my-3" style={{ borderColor: 'currentColor', opacity: 0.2 }}></div>
        <button
          onClick={onAddToFlashcards}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${btnColor}`}
        >
          <FlashcardIcon />
          <span>Add to Flashcards</span>
        </button>
      </div>
    </div>
  );
};

export default WordPopup;