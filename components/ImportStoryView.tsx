import React, { useState } from 'react';
import type { Book } from '../types';
import { useSettingsStore } from '../store/useSettingsStore';
import { littlePrinceMock } from '../data/mockData';

interface ImportStoryViewProps {
  onImport: (book: Book) => void;
  onCancel: () => void;
}

const exampleJson = JSON.stringify(littlePrinceMock, null, 2);

const ImportStoryView: React.FC<ImportStoryViewProps> = ({ onImport, onCancel }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useSettingsStore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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
                setError("Invalid JSON format. Please ensure it matches the example structure.");
            }
        } catch (e) {
            setError("Failed to parse JSON. Please check the file for errors.");
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
                <h2 className="text-2xl font-bold text-center mb-6">Import Story from JSON</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="json-file-input" className="block text-sm font-medium mb-2">JSON File</label>
                        <input
                            id="json-file-input"
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className={`w-full text-sm p-2 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${inputColor}`}
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
                        <h3 className="font-semibold mb-2">Expected JSON Format:</h3>
                        <pre className={`p-4 rounded-lg text-xs overflow-auto max-h-60 ${inputColor}`}>
                            <code>{exampleJson}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ImportStoryView;
