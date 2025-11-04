import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Word as WordType, Paragraph as ParagraphType, Book } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';
import WordPopup from './WordPopup';

interface ReadingViewProps {
    book: Book;
}

const ReadingView: React.FC<ReadingViewProps> = ({ book }) => {
  const { theme } = useSettingsStore();
  const [activeWord, setActiveWord] = useState<WordType | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWordClick = (word: WordType, event: React.MouseEvent<HTMLSpanElement>) => {
    if (activeWord?.id === word.id) {
        setActiveWord(null);
        return;
    }
    setActiveWord(word);
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if(containerRect) {
        let top = rect.bottom - containerRect.top + window.scrollY + 10;
        let left = rect.left - containerRect.left + rect.width / 2;
        setPopupPosition({ top, left });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeWord && !(event.target as Element).closest('.word-popup') && !(event.target as Element).closest('.word-interactive')) {
        setActiveWord(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeWord]);

  return (
    <div ref={containerRef} className={`relative p-4 sm:p-8 md:p-12 lg:p-16 transition-colors duration-300 ${theme === 'sepia' ? 'bg-sepia-base text-sepia-text' : 'bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text'}`}>
        <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold">{book.title}</h1>
                <p className={`text-xl ${theme === 'sepia' ? 'text-sepia-muted' : 'text-gray-500 dark:text-dark-muted'}`}>{book.author}</p>
            </header>

            {book.chapters.map(chapter => (
                <div key={chapter.number}>
                    <h2 className="text-2xl font-semibold mb-8 border-b pb-2">{`Chapter ${chapter.number}`}</h2>
                    <div className="space-y-10">
                        {chapter.paragraphs.map(p => (
                            <Paragraph key={p.id} paragraph={p} onWordClick={handleWordClick} activeWordId={activeWord?.id} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        {activeWord && (
            <WordPopup
                word={activeWord}
                position={popupPosition}
                onClose={() => setActiveWord(null)}
                onAddToFlashcards={() => console.log('Add to flashcards:', activeWord.l2)}
            />
        )}
    </div>
  );
};

interface ParagraphProps {
    paragraph: ParagraphType;
    onWordClick: (word: WordType, event: React.MouseEvent<HTMLSpanElement>) => void;
    activeWordId: string | null;
}

const Paragraph: React.FC<ParagraphProps> = ({ paragraph, onWordClick, activeWordId }) => {
    const { fontSize, scriptFont, isRtl, theme } = useSettingsStore();
    const fontSizes = { sm: 'text-2xl md:text-3xl', base: 'text-3xl md:text-4xl', lg: 'text-4xl md:text-5xl' };
    const paragraphFontSizes = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' };
    
    const fontClass = useMemo(() => {
        switch (scriptFont) {
            case 'uthmani': return 'font-uthmani';
            case 'indopak': return 'font-indopak';
            case 'latin-serif': return 'font-latin-serif';
            default: return 'font-sans';
        }
    }, [scriptFont]);

    const l1Color = theme === 'sepia' ? 'text-sepia-muted' : 'text-gray-500 dark:text-dark-muted';
    const translationBg = theme === 'dark' ? 'bg-dark-surface/50' : theme === 'sepia' ? 'bg-sepia-highlight/50' : 'bg-gray-50';

    return (
        <div className="paragraph-container">
            <div dir={isRtl ? 'rtl' : 'ltr'} className={`flex flex-wrap leading-loose ${fontClass} ${fontSizes[fontSize]}`}>
                {paragraph.words.map((word) => (
                    <Word key={word.id} word={word} onClick={onWordClick} isActive={word.id === activeWordId} />
                ))}
            </div>
            <div dir={isRtl ? 'rtl' : 'ltr'} className={`mt-4 p-4 rounded-lg italic ${paragraphFontSizes[fontSize]} ${translationBg}`}>
                <p className={`${l1Color}`}>{paragraph.translationL1}</p>
            </div>
        </div>
    );
}

interface WordProps {
    word: WordType;
    onClick: (word: WordType, event: React.MouseEvent<HTMLSpanElement>) => void;
    isActive: boolean;
}

const Word: React.FC<WordProps> = ({ word, onClick, isActive }) => {
    const { showWordByWord, theme } = useSettingsStore();
    const activeClass = theme === 'dark' ? 'bg-sky-400/30 text-sky-300' : theme === 'sepia' ? 'bg-amber-600/30 text-amber-800' : 'bg-blue-200/50 text-blue-800';
    const l1Color = theme === 'sepia' ? 'text-sepia-muted' : 'text-gray-400 dark:text-dark-muted';

    return (
        <span className="inline-block px-1 mx-1 cursor-pointer word-interactive" onClick={(e) => onClick(word, e)}>
            <span className={`flex flex-col items-center rounded-md p-1 transition-colors ${isActive ? activeClass : ''}`}>
                <span className="l2-word">{word.l2}</span>
                {showWordByWord && (
                    <span className={`text-xs font-sans ${l1Color}`}>{word.l1}</span>
                )}
            </span>
        </span>
    );
};

export default ReadingView;