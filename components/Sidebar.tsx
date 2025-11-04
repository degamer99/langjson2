import React, { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import type { View, FontSize, Theme, ScriptFont } from '../types';
import { BookIcon, FlashcardIcon, MenuIcon, XIcon, ChevronDownIcon, SunIcon, MoonIcon, SepiaIcon, UploadIcon } from './icons/IconComponents';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const settings = useSettingsStore();

  const getThemeColors = (base: string) => {
    switch (settings.theme) {
      case 'dark': return `bg-dark-surface text-dark-text ${base}`;
      case 'sepia': return `bg-sepia-base text-sepia-text ${base}`;
      default: return `bg-gray-100 text-gray-800 ${base}`;
    }
  };

  const activeBtnClasses = settings.theme === 'dark' ? 'bg-dark-primary text-white' : 'bg-blue-500 text-white';
  const inactiveBtnClasses = settings.theme === 'dark' ? 'bg-dark-surface hover:bg-gray-700' : settings.theme === 'sepia' ? 'bg-sepia-highlight hover:bg-sepia-muted' : 'bg-gray-200 hover:bg-gray-300';

  const renderSidebarContent = () => (
    <div className={`flex flex-col h-full p-4 space-y-6 overflow-y-auto ${getThemeColors('')}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">LangJson 2.0</h1>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <XIcon />
        </button>
      </div>

      <div className="flex-1 space-y-4">
        <CollapsibleSection title="Reading Preferences">
            <SettingRow label="Font Size">
                <div className="flex items-center space-x-1 rounded-lg p-0.5">
                    {(['sm', 'base', 'lg'] as FontSize[]).map(size => (
                        <button key={size} onClick={() => settings.setFontSize(size)} className={`px-3 py-1 text-xs font-semibold rounded-md transition ${settings.fontSize === size ? activeBtnClasses : inactiveBtnClasses}`}>
                            A{size === 'sm' ? '-' : size === 'lg' ? '+' : ''}
                        </button>
                    ))}
                </div>
            </SettingRow>
            <SettingRow label="Word By Word">
                 <Switch isToggled={settings.showWordByWord} onToggle={settings.toggleWordByWord} />
            </SettingRow>
            <SettingRow label="Content Font">
                 <div className="flex items-center space-x-1 rounded-lg p-0.5">
                    {(['uthmani', 'indopak', 'latin-serif'] as ScriptFont[]).map(font => (
                        <button key={font} onClick={() => settings.setScriptFont(font)} className={`px-3 py-1 text-sm rounded-md transition capitalize ${settings.scriptFont === font ? activeBtnClasses : inactiveBtnClasses}`}>
                            {font.replace('-serif', '')}
                        </button>
                    ))}
                </div>
            </SettingRow>
             <SettingRow label="Switch RTL Direction">
                <Switch isToggled={settings.isRtl} onToggle={settings.toggleRtl} />
            </SettingRow>
        </CollapsibleSection>
        
        <CollapsibleSection title="Appearance">
             <SettingRow label="Theme">
                 <div className="flex items-center space-x-1 rounded-lg p-0.5">
                    {(['light', 'dark', 'sepia'] as Theme[]).map(theme => (
                        <button key={theme} onClick={() => settings.setTheme(theme)} className={`p-2 rounded-md transition ${settings.theme === theme ? activeBtnClasses : inactiveBtnClasses}`}>
                           {theme === 'light' ? <SunIcon /> : theme === 'dark' ? <MoonIcon /> : <SepiaIcon />}
                        </button>
                    ))}
                </div>
            </SettingRow>
        </CollapsibleSection>

        <button 
            onClick={() => { setView('import'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${settings.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
            <UploadIcon />
            <span>Import from JSON</span>
        </button>

        <button 
            onClick={() => { setView('reading'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${settings.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
            <BookIcon />
            <span>Reading View</span>
        </button>
        <button 
            onClick={() => { setView('quizConfig'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition ${settings.theme === 'dark' ? 'bg-dark-primary text-white hover:bg-sky-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
            <FlashcardIcon />
            <span>Flashcard Quiz</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`fixed top-4 left-4 z-20 p-2 rounded-md md:hidden ${getThemeColors('shadow-lg')}`}
      >
        <MenuIcon />
      </button>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}>
        {renderSidebarContent()}
      </div>
       {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}


      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 h-screen shadow-lg">
        {renderSidebarContent()}
      </aside>
    </>
  );
};


const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="py-2">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left font-semibold">
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>
            {isOpen && <div className="mt-4 space-y-4">{children}</div>}
        </div>
    );
};

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        {children}
    </div>
);

const Switch: React.FC<{ isToggled: boolean, onToggle: () => void }> = ({ isToggled, onToggle }) => {
  const { theme } = useSettingsStore();
  const bgClass = isToggled ? (theme === 'dark' ? 'bg-dark-primary' : 'bg-blue-500') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200');

  return (
    <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${bgClass}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isToggled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
};


export default Sidebar;