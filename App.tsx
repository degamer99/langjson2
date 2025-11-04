import React, { useState, useEffect } from 'react';
import { useSettingsStore } from './store/useSettingsStore';
import type { View, Book, QuizConfig } from './types';
import Sidebar from './components/Sidebar';
import ReadingView from './components/ReadingView';
import FlashcardConfigView from './components/FlashcardConfigView';
import FlashcardQuizView from './components/FlashcardQuizView';
import ImportStoryView from './components/ImportStoryView';
import { littlePrinceMock } from './data/mockData';
import { useFlashcardStore } from './store/useFlashcardStore';

const App: React.FC = () => {
  const [view, setView] = useState<View>('reading');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [book, setBook] = useState<Book>(littlePrinceMock);

  const { theme } = useSettingsStore();
  const { initializeDeck } = useFlashcardStore();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark', 'sepia');
    html.classList.add(theme);
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#121212';
    } else if (theme === 'sepia') {
        document.body.style.backgroundColor = '#f1e7d0';
    } else {
        document.body.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  useEffect(() => {
    // Initialize the flashcard deck whenever the book changes
    const allWords = book.chapters.flatMap(c => c.paragraphs.flatMap(p => p.words));
    initializeDeck(allWords);
  }, [book, initializeDeck]);

  const handleStartQuiz = (config: QuizConfig) => {
    setQuizConfig(config);
    setView('quiz');
  };

  const handleImportBook = (newBook: Book) => {
    setBook(newBook);
    setView('reading');
  };

  const renderView = () => {
    switch (view) {
      case 'import':
        return <ImportStoryView onImport={handleImportBook} onCancel={() => setView('reading')} />;
      case 'quizConfig':
        return <FlashcardConfigView book={book} onStartQuiz={handleStartQuiz} />;
      case 'quiz':
        return <FlashcardQuizView book={book} config={quizConfig!} onFinish={() => setView('reading')} />;
      case 'reading':
      default:
        return <ReadingView book={book} />;
    }
  };

  return (
    <div className={`flex h-screen font-sans ${theme === 'sepia' ? 'text-sepia-text bg-sepia-base' : 'text-gray-800 dark:text-dark-text bg-white dark:bg-dark-bg'}`}>
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        {renderView()}
      </main>
    </div>
  );
};

export default App;