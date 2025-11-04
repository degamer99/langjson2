import React, { useState } from 'react';
import type { Book } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';

interface ImportStoryViewProps {
  onImport: (book: Book) => void;
  onCancel: () => void;
}


const bgColor = theme === 'dark' ? 'bg-dark-bg' : theme === 'sepia' ? 'bg-sepia-base' : 'bg-gray-50';
const surfaceColor = theme === 'dark' ? 'bg-dark-surface' : theme === 'sepia' ? 'bg-sepia-highlight' : 'bg-white';
const textColor = theme === 'dark' ? 'text-dark-text' : theme === 'sepia' ? 'text-sepia-text' : 'text-gray-800';
const inputColor = theme === 'dark' ? 'bg-gray-700 border-gray-600' : theme === 'sepia' ? 'bg-sepia-base border-sepia-muted' : 'bg-gray-100 border-gray-300';
const buttonColor = theme === 'dark' ? 'bg-dark-primary hover:bg-sky-400' : 'bg-blue-500 hover:bg-blue-600';

// Using a simplified example for the placeholder to keep it clean.
const exampleJson = `{
  "id": "example-story",
  "title": "Example Title",
  "author": "Author Name",
  "languageCode": "en",
  "chapters": [
    {
      "number": 1,
      "title": "Chapter 1",
      "paragraphs": [
        {
          "id": "p1",
          "paragraphNumber": 1,
          "words": [
            { "id": "w1-1", "l2": "Hello", "l1": "Salut" },
            { "id": "w1-2", "l2": "World", "l1": "Monde" }
          ],
          "translationL1": "Hello World"
        }
      ]
    }
  ]
}`;

const ImportStoryView: React.FC<ImportStoryViewProps> = ({ onImport, onCancel }) => {



  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useSettingsStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
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
    try {
      const parsedJson = JSON.parse(fileContent);
      // Basic validation
      if (parsedJson.id && parsedJson.title && Array.isArray(parsedJson.chapters)) {
        onImport(parsedJson as Book);
      } else {
        setError("Invalid JSON structure. Please ensure it matches the example format.");
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(`Invalid JSON format: ${e.message}. Please check the file's syntax and compare it with the example.`);
      } else {
        setError("An unexpected error occurred while processing the file.");
      }
      console.error("Import Error:", e);
    }
  };
}
