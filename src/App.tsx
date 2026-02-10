import { useState, useRef } from 'react';
import Keyboard from './components/Keyboard';
import RichTextEditor from './components/RichTextEditor';
import { FileText, X } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface SettingsState {
  keyFont: string;
  keyFontSize: string;
  textAreaFont: string;
  textAreaFontSize: string;
  textAreaBgColor: string;
  textAreaTextColor: string;
}

function App() {
  const [response, setResponse] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    keyFont: 'sans-serif',
    keyFontSize: 'text-2xl',
    textAreaFont: 'sans-serif',
    textAreaFontSize: 'text-3xl',
    textAreaBgColor: '#000000',
    textAreaTextColor: '#ffffff',
  });

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const handleKeyPress = (key: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    if (key === 'SPACE') {
      editor.commands.insertContent(' ');
    } else {
      editor.commands.insertContent(key);
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
  };

  const handleClear = () => {
    if (!editorRef.current) return;
    editorRef.current.commands.clearContent();
    setResponse('');
  };

  const handleRead = () => {
    if (!editorRef.current) return;

    const plainText = editorRef.current.getText();
    if (!plainText) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10">
            <FileText className="w-6 h-6 text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Simple Writer</h1>
        </div>

        <div className="mb-8 relative">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
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
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10" />
          <Keyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onReturn={handleReturn}
            keyFont={settings.keyFont}
            keyFontSize={settings.keyFontSize}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Click Shift to toggle uppercase • Keys show your selections
          </p>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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

              <div className="mt-6">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
