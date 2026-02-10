import { useState } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onReturn?: () => void;
  keyFont?: string;
  keyFontSize?: string;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function Keyboard({ onKeyPress, onDelete, onReturn, keyFont = 'sans-serif', keyFontSize = 'text-sm' }: KeyboardProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set());
  const [isShiftActive, setIsShiftActive] = useState(false);

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
      setIsShiftActive(!isShiftActive);
    } else if (key === 'CAPSLOCK') {
      setIsShiftActive(!isShiftActive);
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

    return (
      <button
        onClick={() => handleKeyClick(key)}
        className={`
          relative w-16 h-16 rounded-xl font-bold ${keyFontSize}
          transition-all duration-200 ease-out
          ${selectedKey === key ? 'scale-95' : 'scale-100'}
          ${keyHighlighted
            ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
            : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
          }
          backdrop-blur-xl
          border border-white/40
          shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
          hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <div className="space-y-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleKeyClick('TAB')}
            className={`
              relative w-16 h-16 rounded-xl font-semibold text-base
              transition-all duration-200 ease-out
              ${selectedKey === 'TAB' ? 'scale-95' : 'scale-100'}
              ${isHighlighted('TAB')
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <span className="relative z-10 drop-shadow-sm uppercase tracking-wider text-sm">Tab</span>
          </button>
          {keyboardLayout[0].map((key) => renderKey(key))}
          <button
            onClick={() => handleKeyClick('DELETE')}
            className={`
              relative w-20 h-16 rounded-xl font-semibold text-lg
              transition-all duration-200 ease-out
              ${selectedKey === 'DELETE' ? 'scale-95' : 'scale-100'}
              ${isHighlighted('DELETE')
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <Delete className="relative z-10 w-6 h-6 mx-auto" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleKeyClick('CAPSLOCK')}
            className={`
              relative w-16 h-16 rounded-xl font-semibold text-xs
              transition-all duration-200 ease-out
              ${selectedKey === 'CAPSLOCK' ? 'scale-95' : 'scale-100'}
              ${isHighlighted('CAPSLOCK')
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <span className="relative z-10 drop-shadow-sm uppercase tracking-tight">Caps</span>
          </button>
          {keyboardLayout[1].map((key) => renderKey(key))}
          <button
            onClick={() => handleKeyClick('RETURN')}
            className={`
              relative w-24 h-16 rounded-xl font-semibold text-lg
              transition-all duration-200 ease-out
              ${selectedKey === 'RETURN' ? 'scale-95' : 'scale-100'}
              ${isHighlighted('RETURN')
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <CornerDownLeft className="relative z-10 w-6 h-6 mx-auto" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleKeyClick('SHIFT')}
            className={`
              relative w-16 h-16 rounded-xl font-semibold text-sm
              transition-all duration-200 ease-out
              ${selectedKey === 'SHIFT' ? 'scale-95' : 'scale-100'}
              ${isShiftActive
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <span className="relative z-10 drop-shadow-sm uppercase tracking-wide">Shift</span>
          </button>
          {keyboardLayout[2].map((key) => renderKey(key))}
          {renderKey(',')}
          {renderKey('.')}
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => handleKeyClick('SPACE')}
            className={`
              relative w-96 h-16 rounded-xl font-semibold text-lg
              transition-all duration-200 ease-out
              ${selectedKey === 'SPACE' ? 'scale-95' : 'scale-100'}
              ${isHighlighted('SPACE')
                ? 'bg-gradient-to-br from-blue-400/90 to-cyan-500/90 text-white shadow-[0_8px_32px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-br from-white/80 to-gray-100/60 text-gray-700 hover:from-white/90 hover:to-gray-50/70'
              }
              backdrop-blur-xl
              border border-white/40
              shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.1)]
              hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.15),0_6px_20px_rgba(0,0,0,0.15)]
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
            <span className="relative z-10 drop-shadow-sm">SPACE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
