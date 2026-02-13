import { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import RichTextEditor from './components/RichTextEditor';
import { FileText, Printer, Image, Trash2, X, Save, FolderOpen, Download, Upload } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import ReloadPrompt from './components/ReloadPrompt';
import {
  type UserSettings,
  saveSettings,
  loadSettings,
  exportSettings,
  importSettings,
  resetToDefaults,
} from './utils/settingsManager';
import { printDocument } from './utils/printHelpers';
import {
  saveAsTXT,
  exportAsDOCX,
  importFile
} from './utils/fileHelpers';
import { saveFile, loadFile } from './utils/fileSystem';
import FileManagerModal from './components/FileManagerModal';

type SettingsTab = 'general' | 'layout' | 'keys-text' | 'voice' | 'theme';

const PRESET_BACKGROUNDS = [
  { name: 'Nature', url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { name: 'Ocean', url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { name: 'Mountains', url: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { name: 'City', url: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { name: 'Abstract', url: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1920' },
];

function App() {
  const [response, setResponse] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const editorRef = useRef<Editor | null>(null);
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [isAutoReadEnabled, setIsAutoReadEnabled] = useState(false);

  // File Management State
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [fileManagerMode, setFileManagerMode] = useState<'open' | 'save'>('open');
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !settings.selectedVoice) {
        setSettings(prev => ({ ...prev, selectedVoice: availableVoices[0].name }));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);



  // ... (keep existing handleAutoRead and other methods logic if possible, or re-implement)
  // Since replace_file_content replaces the whole block if I select start/end 1-100, I need to be careful not to delete logic I can't see below line 100.
  // Wait, I only viewed lines 1-100. I SHOULD NOT replace lines I haven't seen or that contain logic I'm not duplicating.
  // I will only replace the imports and state initialization at the top, and then I will use a separate replacement for the toolbar.



  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const cleanForSpeech = (text: string): string => {
    // Remove Zero Width Space, Byte Order Mark, and other non-printable characters
    // Normalize ALL whitespace (including non-breaking spaces) to regular spaces
    return text
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\u00A0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, ' ')
      .trim();
  };

  const speakText = (text: string, interrupt = true) => {
    const cleanedText = cleanForSpeech(text);
    if (!cleanedText) return;

    if (interrupt) {
      window.speechSynthesis.cancel();
    }

    // Append a space to ensure the TTS engine treats it as a complete word/sentence
    // This fixes issues where single words without trailing context are read as letters
    const utterance = new SpeechSynthesisUtterance(cleanedText + ' ');

    utterance.rate = settings.readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    const selectedVoiceObj = voices.find(v => v.name === settings.selectedVoice);
    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj;
    }

    // Explicitly set language if voice has one, to avoid browser guessing wrong
    if (selectedVoiceObj?.lang) {
      utterance.lang = selectedVoiceObj.lang;
    }

    window.speechSynthesis.speak(utterance);
  };

  // File Management Handlers
  const handleOpenClick = () => {
    setFileManagerMode('open');
    setIsFileManagerOpen(true);
  };

  const handleSaveClick = () => {
    if (currentFileId) {
      // Save to existing file silently
      if (editorRef.current) {
        saveFile(currentFileName, editorRef.current.getHTML(), settings, currentFileId);
        // Optional: Toast notification here
      }
    } else {
      // Save as new
      setFileManagerMode('save');
      setIsFileManagerOpen(true);
    }
  };

  const handleFileSelect = (fileId: string) => {
    const file = loadFile(fileId);
    if (file && editorRef.current) {
      editorRef.current.commands.setContent(file.content);
      if (file.settings) {
        setSettings(file.settings);
      }
      setCurrentFileId(file.id);
      // Find name from list if needed, or store it in content
      // Find name from list if needed, or store it in content
      // We actually need the name from metadata. 
      // Let's just set ID for now, filename update can happen via list refresh if we stored it in state.
      // Better: receive filename from modal or store in FileContent too.
      setIsFileManagerOpen(false);
    }
  };

  const handleSaveFile = (name: string) => {
    if (editorRef.current) {
      const content = editorRef.current.getHTML();
      const meta = saveFile(name, content, settings, currentFileId || undefined);
      setCurrentFileId(meta.id);
      setCurrentFileName(meta.name);
      setIsFileManagerOpen(false);
    }
  };

  const handleImportText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text && editorRef.current) {
          // Convert newlines to paragraphs for Tiptap
          const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
          editorRef.current.commands.setContent(html);
          setCurrentFileId(null); // Reset current file as this is new content
          setCurrentFileName('');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleExportText = () => {
    if (editorRef.current) {
      saveAsTXT(editorRef.current.getText(), currentFileName || 'document');
    }
  };

  const handleExportNative = () => {
    if (editorRef.current) {
      const content = {
        html: editorRef.current.getHTML(),
        settings: settings
      };
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFileName || 'project'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };



  const handleAutoRead = (trigger: 'SPACE' | 'PERIOD' | 'RETURN') => {
    if (!isAutoReadEnabled || !editorRef.current) return;

    const editor = editorRef.current;
    const { from } = editor.state.selection;
    // Get all text up to the cursor, using newline as separator to detect paragraphs
    const textBefore = editor.state.doc.textBetween(0, from, '\n');

    if (trigger === 'SPACE') {
      // 1. Avoid re-reading on multiple spaces
      if (textBefore.length >= 2 && /\s/.test(textBefore[textBefore.length - 2])) {
        return;
      }

      const words = textBefore.trim().split(/\s+/);
      const lastWord = words[words.length - 1];

      // 2. Avoid re-reading if word ends with punctuation (handled by PERIOD trigger)
      if (lastWord && !/[.!?]$/.test(lastWord)) {
        speakText(lastWord, true);
      }
    } else if (trigger === 'PERIOD' || trigger === 'RETURN') {
      const trimmed = textBefore.trim();
      let lastWord = '';
      let punctuation = '';

      if (trigger === 'PERIOD') {
        punctuation = trimmed.slice(-1); // . ! ?
        const textWithoutLastChar = trimmed.slice(0, -1);
        const cleanTextForMatch = cleanForSpeech(textWithoutLastChar);
        const wordMatch = cleanTextForMatch.match(/(\S+)$/);
        lastWord = wordMatch ? wordMatch[0] : '';
      } else {
        // RETURN
        // 1. If the line ends with punctuation, it was likely already read by the punctuation trigger.
        if (/[.!?]$/.test(trimmed)) {
          return;
        }

        // Just find the last word
        const cleanTextForMatch = cleanForSpeech(trimmed);
        const wordMatch = cleanTextForMatch.match(/(\S+)$/);
        lastWord = wordMatch ? wordMatch[0] : '';
      }

      // Calculate lastSentence first to check for redundancy
      // Find the start of the current sentence by looking backwards for . ! ? OR \n
      let sentenceStart = 0;
      const searchLimit = Math.max(0, textBefore.length - 1000);

      // Iterate backwards; if trigger is PERIOD, skip the last char. If RETURN, skip the last char (newline).
      // Both cases effectively want to find the PREVIOUS punctuation/newline.
      let startSearchIndex = textBefore.length - 2;

      // Fallback: If textBefore is short (e.g. just a newline), start from 0
      if (startSearchIndex < 0) startSearchIndex = 0;

      for (let i = startSearchIndex; i >= searchLimit; i--) {
        const char = textBefore[i];
        if (char === '.' || char === '!' || char === '?' || char === '\n') {
          sentenceStart = i + 1;
          break;
        }
      }

      const lastSentence = textBefore.slice(sentenceStart).trim();

      // 1. Speak the last word (if it exists)
      // interrupt: true because we want to say this word immediately
      // Optimization: If lastWord is basically the same as lastSentence (e.g. one word list item),
      // effectively skip it so we don't say "Cat... Cat".
      if (lastWord) {
        const normalizedWord = lastWord.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedSentence = lastSentence.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Only speak the word if it's NOT the entire sentence
        if (normalizedWord !== normalizedSentence) {
          speakText(lastWord, true);
        }
      }

      // 2. Speak the sentence/line (queueing after the word)
      if (lastSentence) {
        // Condition: if it ends with the punctuation we triggered with, don't double it.
        // For RETURN, we don't usually add punctuation unless we want to pause... 
        // but speakText ensures it's spoken.
        if (punctuation && !lastSentence.endsWith(punctuation)) {
          speakText(lastSentence + punctuation, false);
        } else {
          speakText(lastSentence, false);
        }
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    if (key === 'SPACE') {
      editor.commands.insertContent(' ');
      handleAutoRead('SPACE');
    } else {
      editor.commands.insertContent(key);
      if (key === '.' || key === '!' || key === '?') {
        handleAutoRead('PERIOD');
      }
    }
  };

  const handleDelete = () => {
    if (!editorRef.current) return;
    editorRef.current.commands.deleteRange({
      from: editorRef.current.state.selection.from - 1,
      to: editorRef.current.state.selection.from,
    });
  };

  const handleReturn = () => {
    if (!editorRef.current) return;
    editorRef.current.commands.enter();
    setTimeout(() => handleAutoRead('RETURN'), 0);
  };

  const handleClear = () => {
    if (!editorRef.current) return;
    editorRef.current.commands.clearContent();
    setResponse('');
  };

  const handleRead = () => {
    if (!editorRef.current) return;

    const selection = editorRef.current.state.selection;
    const selectedText = editorRef.current.state.doc.textBetween(selection.from, selection.to, ' ');

    if (selectedText.trim()) {
      speakText(selectedText);
    } else {
      const allText = editorRef.current.getText();
      speakText(allText);
    }
  };

  const handleExportSettings = () => {
    exportSettings(settings);
  };

  const handleImportSettings = async (file: File) => {
    try {
      const imported = await importSettings(file);
      setSettings(imported);
    } catch (error) {
      alert('Failed to import settings. Please check the file format.');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all settings to default values? This cannot be undone.')) {
      const defaults = resetToDefaults();
      setSettings(defaults);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 };
  };

  const getHueFromRgb = (rgb: { r: number; g: number; b: number }) => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return Math.round(h * 360);
  };



  const handleExportDOCX = async () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHTML();
    await exportAsDOCX(html, 'my-clickit-document');
  };

  const handleExportTXT = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHTML();
    saveAsTXT(html, 'my-clickit-document');
  };

  const handleImportDocument = async (file: File) => {
    if (!editorRef.current) return;
    try {
      const content = await importFile(file);
      if (content) {
        // When importing a document (not a project), we might want to append or replace.
        // For now, let's replace to keep it simple, or we could insert at cursor.
        // Let's replace for consistency with "Open".
        editorRef.current.commands.setContent(content);
        setResponse(content);
      }
    } catch (error) {
      alert('Failed to import document.');
    }
  };

  const glassRgb = hexToRgb(settings.glassColor);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-4">File Management</h3>

              <div className="space-y-6">
                {/* Export Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Export Document</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleExportDOCX}
                      className="px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg transition-all border border-indigo-400/30 flex flex-col items-center justify-center gap-1"
                    >
                      <span className="font-bold text-lg">.DOCX</span>
                      <span className="text-xs opacity-70">Word Doc</span>
                    </button>
                    <button
                      onClick={handleExportTXT}
                      className="px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg transition-all border border-indigo-400/30 flex flex-col items-center justify-center gap-1"
                    >
                      <span className="font-bold text-lg">.TXT</span>
                      <span className="text-xs opacity-70">Plain Text</span>
                    </button>
                  </div>
                </div>

                {/* Import Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Import Document</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-all border border-emerald-400/30 flex flex-col items-center justify-center gap-1">
                      <input
                        type="file"
                        accept=".docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImportDocument(file);
                            e.target.value = '';
                            setIsSettingsOpen(false);
                          }
                        }}
                        className="hidden"
                      />
                      <span className="font-bold text-lg">.DOCX</span>
                      <span className="text-xs opacity-70">Word Doc</span>
                    </label>

                    <label className="cursor-pointer px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-all border border-emerald-400/30 flex flex-col items-center justify-center gap-1">
                      <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImportDocument(file);
                            e.target.value = '';
                            setIsSettingsOpen(false);
                          }
                        }}
                        className="hidden"
                      />
                      <span className="font-bold text-lg">.TXT</span>
                      <span className="text-xs opacity-70">Plain Text</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Settings Management</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportSettings}
                  className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all border border-blue-400/30 text-left"
                >
                  <div className="font-medium">Export Settings</div>
                  <div className="text-sm text-blue-300/70 mt-1">Save your current settings to a file</div>
                </button>

                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImportSettings(file);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                    id="import-settings"
                  />
                  <div
                    onClick={() => document.getElementById('import-settings')?.click()}
                    className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-all border border-green-400/30 cursor-pointer"
                  >
                    <div className="font-medium">Import Settings</div>
                    <div className="text-sm text-green-300/70 mt-1">Load settings from a file</div>
                  </div>
                </label>

                <button
                  onClick={handleResetToDefaults}
                  className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all border border-red-400/30 text-left"
                >
                  <div className="font-medium">Reset to System Defaults</div>
                  <div className="text-sm text-red-300/70 mt-1">Restore all settings to their original values</div>
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">About</h3>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-gray-300 leading-relaxed">
                  CLICK-IT Writer is a customizable text editor with an on-screen keyboard,
                  rich text formatting, and text-to-speech capabilities. All your settings
                  are automatically saved and can be exported to share across devices.
                </p>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Keyboard</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">Keyboard Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="keyboardType"
                        value="basic"
                        checked={settings.keyboardType === 'basic'}
                        onChange={(e) => setSettings({ ...settings, keyboardType: e.target.value as 'basic' | 'with-numbers' | 'none' })}
                        className="mr-3"
                      />
                      <span className="text-white">Basic Keyboard</span>
                    </label>
                    <label className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="keyboardType"
                        value="with-numbers"
                        checked={settings.keyboardType === 'with-numbers'}
                        onChange={(e) => setSettings({ ...settings, keyboardType: e.target.value as 'basic' | 'with-numbers' | 'none' })}
                        className="mr-3"
                      />
                      <span className="text-white">Keyboard w/ Numbers</span>
                    </label>
                    <label className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                      <input
                        type="radio"
                        name="keyboardType"
                        value="none"
                        checked={settings.keyboardType === 'none'}
                        onChange={(e) => setSettings({ ...settings, keyboardType: e.target.value as 'basic' | 'with-numbers' | 'none' })}
                        className="mr-3"
                      />
                      <span className="text-white">No Keyboard</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.colorCodingEnabled}
                      onChange={(e) => setSettings({ ...settings, colorCodingEnabled: e.target.checked })}
                      className="mr-3"
                    />
                    <span className="text-white">Color Coding</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'keys-text':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Keyboard Keys</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.keyFont}
                    onChange={(e) => setSettings({ ...settings, keyFont: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <select
                    value={settings.keyFontSize}
                    onChange={(e) => setSettings({ ...settings, keyFontSize: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text-xl">Extra Small</option>
                    <option value="text-2xl">Small</option>
                    <option value="text-3xl">Medium</option>
                    <option value="text-4xl">Large</option>
                    <option value="text-5xl">Extra Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Text Area</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.textAreaFont}
                    onChange={(e) => setSettings({ ...settings, textAreaFont: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <select
                    value={settings.textAreaFontSize}
                    onChange={(e) => setSettings({ ...settings, textAreaFontSize: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text-2xl">Small</option>
                    <option value="text-3xl">Medium</option>
                    <option value="text-4xl">Large</option>
                    <option value="text-5xl">Extra Large</option>
                    <option value="text-6xl">2X Large</option>
                    <option value="text-7xl">3X Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.textAreaBgColor}
                    onChange={(e) => setSettings({ ...settings, textAreaBgColor: e.target.value })}
                    className="w-full h-10 px-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.textAreaTextColor}
                    onChange={(e) => setSettings({ ...settings, textAreaTextColor: e.target.value })}
                    className="w-full h-10 px-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voice
              </label>
              <select
                value={settings.selectedVoice}
                onChange={(e) => setSettings({ ...settings, selectedVoice: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reading Speed: {settings.readingSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.readingSpeed}
                onChange={(e) => setSettings({ ...settings, readingSpeed: parseFloat(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-gray-400">
                Select a voice and adjust the reading speed. Click "Read" in the editor to hear your text read aloud.
              </p>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={settings.glassColor}
                onChange={(e) => setSettings({ ...settings, glassColor: e.target.value })}
                className="w-full h-10 px-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                Changes the page background color that shows through the glass effect
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Style
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, backgroundStyle: 'glass' })}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${settings.backgroundStyle === 'glass'
                      ? 'bg-blue-500/30 text-blue-200 border-2 border-blue-400'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                  >
                    Glass
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, backgroundStyle: 'flat' })}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${settings.backgroundStyle === 'flat'
                      ? 'bg-blue-500/30 text-blue-200 border-2 border-blue-400'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                  >
                    Flat
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {settings.backgroundStyle === 'glass'
                    ? 'Gradient effect with color mixing'
                    : 'Solid color background'}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Background Image
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.backgroundImageEnabled}
                    onChange={(e) => setSettings({ ...settings, backgroundImageEnabled: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">Enable</span>
                </label>
              </div>

              <div className={`space-y-4 ${!settings.backgroundImageEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Custom URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.backgroundImage}
                      onChange={(e) => setSettings({ ...settings, backgroundImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {settings.backgroundImage && (
                      <button
                        onClick={() => setSettings({ ...settings, backgroundImage: '' })}
                        className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preset Backgrounds
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.name}
                        onClick={() => setSettings({ ...settings, backgroundImage: bg.url })}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${settings.backgroundImage === bg.url
                          ? 'border-blue-500'
                          : 'border-white/10 hover:border-white/30'
                          }`}
                      >
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{bg.name}</span>
                        </div>
                        {settings.backgroundImage === bg.url && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Image className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundColor: settings.backgroundImageEnabled && settings.backgroundImage ? 'transparent' : undefined,
      }}
    >
      {settings.backgroundImageEnabled && settings.backgroundImage ? (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20"
          style={{ backgroundImage: `url(${settings.backgroundImage})` }}
        />
      ) : settings.backgroundStyle === 'flat' ? (
        <div
          className="fixed inset-0 -z-20"
          style={{ backgroundColor: settings.glassColor }}
        />
      ) : (
        <>
          <div
            className="fixed inset-0 -z-20"
            style={{
              background: `linear-gradient(to bottom right,
                hsl(${getHueFromRgb(glassRgb)}, 30%, 8%),
                hsl(${getHueFromRgb(glassRgb)}, 40%, 12%),
                hsl(${getHueFromRgb(glassRgb)}, 30%, 8%))`
            }}
          />
          <div
            className="fixed inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 30% 50%, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.12), transparent 50%)`
            }}
          />
        </>
      )}

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl backdrop-blur-xl border border-white/10 shadow-[0_4px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] bg-white/10">
            <FileText className="w-6 h-6 drop-shadow-lg text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mr-auto">CLICK-IT Writer</h1>

          {/* File Operations Group */}
          <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
            <button
              onClick={handleOpenClick}
              className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/20 font-medium transition-all text-sm flex items-center gap-2 shadow-sm"
              title="Open saved file"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open</span>
            </button>

            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/20 font-medium transition-all text-sm flex items-center gap-2 shadow-sm"
              title={currentFileId ? "Save changes" : "Save as new file"}
            >
              <Save className="w-4 h-4" />
              <span>{currentFileId ? 'Save' : 'Save As'}</span>
            </button>
          </div>

          {/* Import/Export Group */}
          <div className="flex items-center gap-2 mr-auto">
            {/* Import Text */}
            <label className="cursor-pointer px-3 py-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-lg border border-white/10 transition-all text-sm flex items-center gap-2" title="Import plain text file">
              <input
                type="file"
                accept=".txt"
                onChange={handleImportText}
                className="hidden"
              />
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import txt</span>
            </label>

            {/* Export Text */}
            <button
              onClick={handleExportText}
              className="px-3 py-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-lg border border-white/10 transition-all text-sm flex items-center gap-2"
              title="Export as plain text"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export txt</span>
            </button>

            {/* Export Project */}
            <button
              onClick={handleExportNative}
              className="px-3 py-2 bg-black/20 hover:bg-black/40 text-blue-300/80 hover:text-blue-300 rounded-lg border border-blue-500/20 transition-all text-sm flex items-center gap-2"
              title="Backup Project (JSON)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (editorRef.current) {
                printDocument(editorRef.current.getHTML());
              }
            }}
            className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/20 font-medium transition-all text-sm flex items-center gap-2 shadow-sm"
            title="Print document"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="mb-8 relative">
        <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative p-6">
            <RichTextEditor
              content={response}
              onChange={setResponse}
              onEditorReady={handleEditorReady}
              textAreaFont={settings.textAreaFont}
              textAreaFontSize={settings.textAreaFontSize}
              textAreaTextColor={settings.textAreaTextColor}
              textAreaBgColor={settings.textAreaBgColor}
              onRead={handleRead}
              onClear={handleClear}
              onSettingsClick={() => setIsSettingsOpen(true)}
              minHeight={settings.keyboardType === 'none' ? '525px' : '210px'}
              maxHeight={settings.keyboardType === 'none' ? '875px' : '350px'}
              isAutoReadEnabled={isAutoReadEnabled}
              onToggleAutoRead={() => setIsAutoReadEnabled(!isAutoReadEnabled)}
              onAutoReadTrigger={handleAutoRead}
            />
          </div>
        </div>
      </div>

      {settings.keyboardType !== 'none' && (
        <div className="relative">
          <div
            className="absolute inset-0 rounded-3xl blur-3xl -z-10"
            style={{
              background: `linear-gradient(to bottom right, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.1), rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.05))`
            }}
          />
          <Keyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onReturn={handleReturn}
            keyFont={settings.keyFont}
            keyFontSize={settings.keyFontSize}
            keyboardType={settings.keyboardType}
            colorCodingEnabled={settings.colorCodingEnabled}
          />
        </div>
      )}



      {/* PWA Update Notification */}
      <ReloadPrompt />

      {
        isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="relative p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Settings</h2>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-1 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'general'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('layout')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'layout'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Layout
                  </button>
                  <button
                    onClick={() => setActiveTab('keys-text')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'keys-text'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setActiveTab('voice')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'voice'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Voice
                  </button>
                  <button
                    onClick={() => setActiveTab('theme')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'theme'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    Theme
                  </button>
                </div>
              </div>

              <div className="relative p-6 overflow-y-auto flex-1">
                {renderTabContent()}
              </div>

              <div className="relative p-6 pt-0">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* Modals */}
      <FileManagerModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        onSelect={handleFileSelect}
        onSave={handleSaveFile}
        mode={fileManagerMode}
        initialName={currentFileName}
      />
    </div >
  );
}

export default App;
