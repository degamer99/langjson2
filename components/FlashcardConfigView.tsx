import React, { useState, useMemo } from 'react';
import type { QuizConfig, Book } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';

interface FlashcardConfigViewProps {
  book: Book;
  onStartQuiz: (config: QuizConfig) => void;
}

const FlashcardConfigView: React.FC<FlashcardConfigViewProps> = ({ book, onStartQuiz }) => {
  const allParagraphs = useMemo(() => book.chapters.flatMap(c => c.paragraphs), [book]);
  const [startParagraph, setStartParagraph] = useState(1);
  const [endParagraph, setEndParagraph] = useState(allParagraphs.length > 0 ? Math.min(3, allParagraphs.length) : 1);
  const { theme } = useSettingsStore();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({
      quizType: 'Vocabulary',
      startParagraph,
      endParagraph
    });
  };
  
  const totalCards = useMemo(() => {
    if (startParagraph > endParagraph) return 0;
    return allParagraphs
        .filter(p => p.paragraphNumber >= startParagraph && p.paragraphNumber <= endParagraph)
        .reduce((sum, p) => sum + p.words.length, 0);
  }, [allParagraphs, startParagraph, endParagraph]);

  const bgColor = theme === 'dark' ? 'bg-dark-bg' : theme === 'sepia' ? 'bg-sepia-base' : 'bg-gray-50';
  const surfaceColor = theme === 'dark' ? 'bg-dark-surface' : theme === 'sepia' ? 'bg-sepia-highlight' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-dark-text' : theme === 'sepia' ? 'text-sepia-text' : 'text-gray-800';
  const inputColor = theme === 'dark' ? 'bg-gray-700 border-gray-600' : theme === 'sepia' ? 'bg-sepia-base border-sepia-muted' : 'bg-gray-100 border-gray-300';
  const buttonColor = theme === 'dark' ? 'bg-dark-primary hover:bg-sky-400' : 'bg-blue-500 hover:bg-blue-600';


  return (
    <div className={`flex items-center justify-center h-full p-4 ${bgColor} ${textColor}`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${surfaceColor}`}>
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Setup</h2>
        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label htmlFor="quiz-type" className="block text-sm font-medium mb-2">Quiz Type</label>
            <select id="quiz-type" className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${inputColor}`}>
              <option>Vocabulary</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="start-paragraph" className="block text-sm font-medium mb-2">Start Paragraph</label>
              <input 
                type="number" 
                id="start-paragraph" 
                value={startParagraph} 
                onChange={e => setStartParagraph(Math.max(1, parseInt(e.target.value)))} 
                min="1"
                max={allParagraphs.length}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${inputColor}`}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end-paragraph" className="block text-sm font-medium mb-2">End Paragraph</label>
              <input 
                type="number" 
                id="end-paragraph" 
                value={endParagraph} 
                onChange={e => setEndParagraph(Math.max(startParagraph, parseInt(e.target.value)))}
                min={startParagraph}
                max={allParagraphs.length}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${inputColor}`}
              />
            </div>
          </div>
          <div className="text-center text-sm opacity-80 pt-2">
            Total Cards: {totalCards}
          </div>
          <button type="submit" className={`w-full py-3 text-white font-bold rounded-lg transition ${buttonColor}`}>
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlashcardConfigView;
