import { useState, useRef, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import RichTextEditor from './components/RichTextEditor';
import { FileText, X, Image, Trash2 } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface SettingsState {
  keyFont: string;
  keyFontSize: string;
  textAreaFont: string;
  textAreaFontSize: string;
  textAreaBgColor: string;
  textAreaTextColor: string;
  selectedVoice: string;
  readingSpeed: number;
  glassColor: string;
  backgroundImage: string;
  backgroundImageEnabled: boolean;
}

type SettingsTab = 'keys-text' | 'voice' | 'appearance';

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
  const [activeTab, setActiveTab] = useState<SettingsTab>('keys-text');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const editorRef = useRef<Editor | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    keyFont: 'sans-serif',
    keyFontSize: 'text-2xl',
    textAreaFont: 'sans-serif',
    textAreaFontSize: 'text-3xl',
    textAreaBgColor: '#000000',
    textAreaTextColor: '#ffffff',
    selectedVoice: '',
    readingSpeed: 1,
    glassColor: '#3b82f6',
    backgroundImage: '',
    backgroundImageEnabled: false,
  });

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
    utterance.rate = settings.readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    const selectedVoiceObj = voices.find(v => v.name === settings.selectedVoice);
    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 };
  };

  const glassRgb = hexToRgb(settings.glassColor);

  const renderTabContent = () => {
    switch (activeTab) {
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

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Glass Effect Color
              </label>
              <input
                type="color"
                value={settings.glassColor}
                onChange={(e) => setSettings({ ...settings, glassColor: e.target.value })}
                className="w-full h-10 px-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">
                This color influences the liquid glass effect on the page
              </p>
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
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          settings.backgroundImage === bg.url
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
      ) : (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-20" />
          <div
            className="fixed inset-0 -z-10"
            style={{
              background: `radial-gradient(circle at 30% 50%, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.1), transparent 50%), radial-gradient(circle at 70% 80%, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.08), transparent 50%)`
            }}
          />
        </>
      )}

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="p-3 rounded-xl backdrop-blur-xl border border-white/10 shadow-[0_4px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]"
            style={{
              background: `linear-gradient(to bottom right, rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.2), rgba(${glassRgb.r},${glassRgb.g},${glassRgb.b},0.1))`
            }}
          >
            <FileText className="w-6 h-6 drop-shadow-lg" style={{ color: `rgb(${glassRgb.r},${glassRgb.g},${glassRgb.b})` }} />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">Simple Writer</h1>
        </div>

        <div className="mb-8 relative">
          <div className="relative overflow-hidden rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-2xl">
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
          />
        </div>

      </div>

      {isSettingsOpen && (
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
                  onClick={() => setActiveTab('keys-text')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === 'keys-text'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Keys & Text
                </button>
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === 'voice'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Voice
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === 'appearance'
                      ? 'text-blue-300 bg-white/10 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Appearance
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
      )}
    </div>
  );
}

export default App;
