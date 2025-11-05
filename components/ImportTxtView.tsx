import React, { useState } from 'react';
import type { Book, Paragraph, Word } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';

interface ImportTxtViewProps {
  onImport: (book: Book) => void;
  onCancel: () => void;
}

const exampleTxt =
  `Hausa sentence 1	Word: Word  by: by  Word 1: Translation 1	English translation 1
Hausa sentence 2	Word: Word  by: by  Word 2: Translation 2	English translation 2`;


/**
 * Parses the tab-separated text content into a Book object.
 * Assumes the format:
 * [Hausa Sentence] \t [Word: Trans  Word: Trans] \t [English Sentence]
 */
const parseTxtToBook = (txtContent: string, title: string, languageCode: string = 'ha'): Book => {
  // --- Delimiters based on your TXT file ---
  // How to split the main columns (e.g., Hausa \t Words \t English)
  const columnDelimiter = '\t';

  // --- THIS IS THE FIX ---
  // How to split word pairs from each other (e.g., "Word1: Trans1" from "Word2: Trans2")
  // Your file uses a NON-BREAKING SPACE (U+00A0), not regular spaces.
  const pairDelimiter = '\u00A0';
  // ---

  // How to split the word from its translation (e.g., "Word1" from "Trans1")
  const wordDelimiter = ': '; // Colon + space
  // ---

  const lines = txtContent.split('\n').filter(line => line.trim().length > 0);
  const paragraphs: Paragraph[] = [];
  let paragraphNumber = 1;

  for (const line of lines) {
    const parts = line.split(columnDelimiter);
    if (parts.length < 3) { // Allow for lines that might be just 3 parts
      console.warn("Skipping malformed line:", line);
      continue;
    }

    const [l2Sentence, wordByWord, l1Sentence] = parts;

    const words: Word[] = [];
    // Split the middle column by the non-breaking space
    const wordPairs = wordByWord.split(pairDelimiter);

    for (const [index, pair] of wordPairs.entries()) {
      if (pair.trim() === "") continue; // Skip empty pairs

      const pairParts = pair.split(wordDelimiter);
      let l2, l1;

      if (pairParts.length === 2) {
        l2 = pairParts[0].trim();
        l1 = pairParts[1].trim().replace(/,$/, ''); // Clean up trailing commas
      } else {
        // Handle cases where there might not be a delimiter
        l2 = pair.trim();
        l1 = '???';
        console.warn(`Could not split pair: "${pair}"`);
      }

      words.push({
        id: `p${paragraphNumber}-w${index + 1}`,
        l2: l2,
        l1: l1,
      });
    }

    if (words.length > 0) {
      paragraphs.push({
        id: `p${paragraphNumber}`,
        paragraphNumber: paragraphNumber,
        // Re-join the L2 words to form the full "sentence" for the top part
        // This is a fallback in case the L2 sentence part is not just the words
        // But for your format, l2Sentence is more accurate.
        // We will use the provided l2Sentence.
        // Note: The ReadingView doesn't show the full L2 sentence, only the words.
        words: words,
        translationL1: l1Sentence.trim(),
      });
      paragraphNumber++;
    }
  }

  return {
    id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: title,
    author: 'Imported from TXT',
    languageCode: languageCode,
    chapters: [
      {
        number: 1,
        title: 'Chapter 1',
        paragraphs: paragraphs,
      },
    ],
  };
};

const ImportTxtView: React.FC<ImportTxtViewProps> = ({ onImport, onCancel }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [languageCode, setLanguageCode] = useState<string>('ha');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useSettingsStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Use filename as default title
      setBookTitle(file.name.replace(/\.txt$/i, ''));
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setFileContent(text);
          setError(null);
        }
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
      }
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (!fileContent) {
      setError("Please select a file first.");
      return;
    }
    if (!bookTitle.trim()) {
      setError("Please provide a title for the book.");
      return;
    }
    try {
      const parsedBook = parseTxtToBook(fileContent, bookTitle.trim(), languageCode.trim());
      if (parsedBook.chapters[0].paragraphs.length > 0) {
        onImport(parsedBook);
      } else {
        setError("The file was empty or contained no valid parsable lines. Check delimiters.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to parse the TXT file. Please check the file for errors.");
    }
  };

  const bgColor = theme === 'dark' ? 'bg-dark-bg' : theme === 'sepia' ? 'bg-sepia-base' : 'bg-gray-50';
  const surfaceColor = theme === 'dark' ? 'bg-dark-surface' : theme === 'sepia' ? 'bg-sepia-highlight' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-dark-text' : theme === 'sepia' ? 'text-sepia-text' : 'text-gray-800';
  const inputColor = theme === 'dark' ? 'bg-gray-700 border-gray-600' : theme === 'sepia' ? 'bg-sepia-base border-sepia-muted' : 'bg-gray-100 border-gray-300';
  const buttonColor = theme === 'dark' ? 'bg-dark-primary hover:bg-sky-400' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className={`flex items-center justify-center h-full p-4 ${bgColor} ${textColor}`}>
      <div className={`w-full max-w-2xl p-8 rounded-xl shadow-lg ${surfaceColor}`}>
        <h2 className="text-2xl font-bold text-center mb-6">Import Story from TXT</h2>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="txt-file-input" className="block text-sm font-medium mb-2">TXT File</label>
              <input
                id="txt-file-input"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className={`w-full text-sm p-2 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${inputColor}`}
              />
            </div>
            <div className="w-1img/3">
              <label htmlFor="lang-code" className="block text-sm font-medium mb-2">Lang Code</label>
              <input
                id="lang-code"
                type="text"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                placeholder="e.g., 'ha'"
                className={`w-full p-2.5 rounded-lg border ${inputColor}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="book-title" className="block text-sm font-medium mb-2">Book Title</label>
            <input
              id="book-title"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Enter a title for the story..."
              className={`w-full p-3 rounded-lg border ${inputColor}`}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className={`w-full py-3 font-bold rounded-lg transition ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}>
              Cancel
            </button>
            <button onClick={handleImport} className={`w-full py-3 text-white font-bold rounded-lg transition ${buttonColor}`}>
              Load Story
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Expected TXT Format (Tab-Separated):</h3>
            <pre className={`p-4 rounded-lg text-xs overflow-auto max-h-60 ${inputColor}`}>
              <code>{exampleTxt}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImportTxtView;
