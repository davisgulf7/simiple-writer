import { useState } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onReturn?: () => void;
  keyFont?: string;
  keyFontSize?: string;
  keyboardType?: 'basic' | 'with-numbers' | 'none';
  colorCodingEnabled?: boolean;
  isShiftActive?: boolean;
  onToggleShift?: () => void;
  onToggleCaps?: () => void;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const getKeyColor = (key: string): string => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const consonants = ['q', 'w', 'r', 't', 'y', 'p', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
  const punctuation = [',', '.', '!', '?', ';', ':', '"', "'", '(', ')', '[', ']', '{', '}'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const modifiers = ['SPACE', 'SHIFT', 'RETURN', 'TAB', 'CAPS'];
  const controlKeys = ['DELETE', 'CAPSLOCK', 'BACKSPACE'];

  if (vowels.includes(key.toLowerCase())) {
    return 'from-purple-200/80 to-purple-300/60';
  }
  if (consonants.includes(key.toLowerCase())) {
    return 'from-orange-200/80 to-orange-300/60';
  }
  if (punctuation.includes(key)) {
    return 'from-green-200/80 to-green-300/60';
  }
  if (numbers.includes(key)) {
    return 'from-blue-200/80 to-blue-300/60';
  }
  if (modifiers.includes(key)) {
    return 'from-yellow-200/80 to-yellow-300/60';
  }
  if (controlKeys.includes(key)) {
    return 'from-red-200/80 to-red-300/60';
  }

  return 'from-white/80 to-gray-100/60';
};

export default function Keyboard({
  onKeyPress,
  onDelete,
  onReturn,
  keyFont = 'sans-serif',
  keyFontSize = 'text-sm',
  keyboardType = 'basic',
  colorCodingEnabled = false,
  isShiftActive = false,
  onToggleShift,
  onToggleCaps,
}: KeyboardProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set());

  const handleKeyClick = (key: string) => {
    setSelectedKey(key);

    if (key !== 'SHIFT' && key !== 'CAPSLOCK') {
      const newHighlighted = new Set(highlightedKeys);
      newHighlighted.add(key);
      setHighlightedKeys(newHighlighted);

      setTimeout(() => {
        setHighlightedKeys(prev => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
      }, 500);
    }

    if (key === 'DELETE') {
      onDelete?.();
    } else if (key === 'RETURN') {
      onReturn?.();
    } else if (key === 'SHIFT') {
      onToggleShift?.();
    } else if (key === 'CAPSLOCK') {
      onToggleCaps?.();
    } else if (key === 'TAB') {
      onKeyPress?.('\t');
    } else {
      const outputKey = isShiftActive ? key.toUpperCase() : key;
      onKeyPress?.(outputKey);
    }

    setTimeout(() => setSelectedKey(null), 200);
  };

  const isHighlighted = (key: string) => highlightedKeys.has(key);

  const renderKey = (key: string, extraClasses = '') => {
    const displayKey = isShiftActive && key.length === 1 ? key.toUpperCase() : key;
    const isShift = key === 'SHIFT';
    const keyHighlighted = isShift ? isShiftActive : isHighlighted(key);
    const keyColor = colorCodingEnabled ? getKeyColor(key) : 'from-white/80 to-gray-100/60';

    return (
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleKeyClick(key)}
        className={`
          relative w-16 h-16 rounded-xl font-bold ${keyFontSize}
          transition-all duration-200 ease-out
          ${selectedKey === key ? 'scale-95' : 'scale-100'}
          ${keyHighlighted
            ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
            : `bg-gradient-to-br ${keyColor} text-gray-700 hover:brightness-110`
          }
          backdrop-blur-xl
          border border-white/40
          shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]
          hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.55),0_12px_20px_rgba(0,0,0,0.45)]
          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.1)]
          before:absolute before:inset-0 before:rounded-xl
          before:bg-gradient-to-br before:from-white/30 before:to-transparent
          before:opacity-100 before:pointer-events-none
          after:absolute after:inset-[2px] after:rounded-lg
          after:bg-gradient-to-br after:from-transparent after:to-black/5
          after:pointer-events-none
          ${extraClasses}
        `}
        style={{ fontFamily: keyFont }}
      >
        <span className="relative z-10 drop-shadow-sm">{displayKey}</span>
      </button>
    );
  };

  if (keyboardType === 'none') {
    return null;
  }

  const renderSpecialKey = (
    key: string,
    content: React.ReactNode,
    widthClass: string = 'w-16',
    textSize: string = 'text-base'
  ) => {
    const keyColor = colorCodingEnabled ? getKeyColor(key) : 'from-white/80 to-gray-100/60';
    const keyHighlighted = key === 'SHIFT' || key === 'CAPSLOCK' ? isShiftActive : isHighlighted(key);

    return (
      <button
        onClick={() => handleKeyClick(key)}
        className={`
          relative ${widthClass} h-16 rounded-xl font-semibold ${textSize}
          transition-all duration-200 ease-out
          ${selectedKey === key ? 'scale-95' : 'scale-100'}
          ${keyHighlighted
            ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
            : `bg-gradient-to-br ${keyColor} text-gray-700 hover:brightness-110`
          }
          backdrop-blur-xl
          border border-white/40
          shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]
          hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.55),0_12px_20px_rgba(0,0,0,0.45)]
          active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.1)]
          before:absolute before:inset-0 before:rounded-xl
          before:bg-gradient-to-br before:from-white/30 before:to-transparent
          before:opacity-100 before:pointer-events-none
          after:absolute after:inset-[2px] after:rounded-lg
          after:bg-gradient-to-br after:from-transparent after:to-black/5
          after:pointer-events-none
        `}
        style={{ fontFamily: keyFont }}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <div className="space-y-3">
        {keyboardType === 'with-numbers' && (
          <div className="flex justify-center gap-2">
            {numberRow.map((num) => renderKey(num))}
          </div>
        )}
        <div className="flex justify-center gap-2">
          {renderSpecialKey('TAB', <span className="relative z-10 drop-shadow-sm uppercase tracking-wider text-sm">Tab</span>)}
          {keyboardLayout[0].map((key) => renderKey(key))}
          {renderSpecialKey('DELETE', <Delete className="relative z-10 w-6 h-6 mx-auto" />, 'w-20', 'text-lg')}
        </div>

        <div className="flex justify-center gap-2">
          {renderSpecialKey('CAPSLOCK', <span className="relative z-10 drop-shadow-sm uppercase tracking-tight">Caps</span>, 'w-16', 'text-xs')}
          {keyboardLayout[1].map((key) => renderKey(key))}
          {renderSpecialKey('RETURN', <CornerDownLeft className="relative z-10 w-6 h-6 mx-auto" />, 'w-24', 'text-lg')}
        </div>

        <div className="flex justify-center gap-2">
          {renderSpecialKey('SHIFT', <span className="relative z-10 drop-shadow-sm uppercase tracking-wide">Shift</span>, 'w-16', 'text-sm')}
          {keyboardLayout[2].map((key) => renderKey(key))}
          {renderKey(',')}
          {renderKey('.')}
          {renderKey('?')}
        </div>

        <div className="flex justify-center gap-2 pt-2">
          {renderSpecialKey('SPACE', <span className="relative z-10 drop-shadow-sm">SPACE</span>, 'w-96', 'text-lg')}
        </div>
      </div>
    </div>
  );
}
