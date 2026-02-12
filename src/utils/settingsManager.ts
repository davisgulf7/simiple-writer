export interface UserSettings {
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
  backgroundStyle: 'glass' | 'flat';
  keyboardType: 'basic' | 'with-numbers' | 'none';
  colorCodingEnabled: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
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
  backgroundStyle: 'glass',
  keyboardType: 'basic',
  colorCodingEnabled: false,
};

const STORAGE_KEY = 'click-it-writer-settings';

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const exportSettings = (settings: UserSettings): void => {
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `click-it-writer-settings-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importSettings = (file: File): Promise<UserSettings> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const settings = { ...DEFAULT_SETTINGS, ...json };
        resolve(settings);
      } catch (error) {
        reject(new Error('Invalid settings file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const resetToDefaults = (): UserSettings => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_SETTINGS };
};
