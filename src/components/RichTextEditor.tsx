import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '../utils/fontSizeExtension';
import { useEffect, useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Type,
  FileText,
  Volume2,
  Settings,
  X,
  MessageSquare,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady?: (editor: any) => void;
  textAreaFont: string;
  textAreaFontSize: string;
  textAreaTextColor: string;
  textAreaBgColor: string;
  onRead: () => void;
  onClear: () => void;
  onSettingsClick: () => void;
  minHeight?: string;
  maxHeight?: string;
  isAutoReadEnabled: boolean;
  onToggleAutoRead: () => void;
  onAutoReadTrigger: (trigger: 'SPACE' | 'PERIOD') => void;
}

export default function RichTextEditor({
  content,
  onChange,
  onEditorReady,
  textAreaFont,
  textAreaFontSize,
  textAreaTextColor,
  textAreaBgColor,
  onRead,
  onClear,
  onSettingsClick,
  minHeight = '210px',
  maxHeight = '350px',
  isAutoReadEnabled,
  onToggleAutoRead,
  onAutoReadTrigger,
}: RichTextEditorProps) {
  const [showFormatting, setShowFormatting] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const highlightMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (highlightMenuRef.current && !highlightMenuRef.current.contains(event.target as Node)) {
        setShowHighlightMenu(false);
      }
    };

    if (showHighlightMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHighlightMenu]);

  // Handle physical keyboard events for Auto-Read
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing using the keyboard below...',
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'outline-none focus:outline-none text-left', // Added text-left
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Handle physical keyboard events for Auto-Read
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editor) return;

      if (e.key === ' ' || e.code === 'Space') {
        const { from } = editor.state.selection;
        // Check if there is already a space before the cursor
        const textBefore = editor.state.doc.textBetween(Math.max(0, from - 1), from);
        if (textBefore === ' ') {
          return; // Don't trigger if already a space (prevent double-read on 2nd space)
        }
        setTimeout(() => onAutoReadTrigger('SPACE'), 0);
      } else if (e.key === '.' || e.key === '!' || e.key === '?') {
        setTimeout(() => onAutoReadTrigger('PERIOD'), 0);
      }
    };

    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('keydown', handleKeyDown as any);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('keydown', handleKeyDown as any);
      }
    };
  }, [onAutoReadTrigger, editor]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm">
        <button
          onClick={() => setShowFormatting(!showFormatting)}
          className={`p-2 rounded-lg transition-all duration-200 ${showFormatting
            ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
            : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
            }`}
          title="Toggle Formatting"
        >
          <FileText className="w-4 h-4" />
        </button>

        {showFormatting && (
          <>
            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('bold')
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('italic')
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('underline')
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: 'left' })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: 'center' })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive({ textAlign: 'right' })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('heading', { level: 1 })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('heading', { level: 2 })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('heading', { level: 3 })
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('bulletList')
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('orderedList')
                ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <div className="relative" ref={highlightMenuRef}>
              <button
                onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                className={`p-2 rounded-lg transition-all duration-200 ${editor.isActive('highlight') || showHighlightMenu
                  ? 'bg-blue-500/40 text-blue-200 border border-blue-400/60'
                  : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
                  }`}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4" />
              </button>

              {showHighlightMenu && (
                <div className="absolute top-full left-0 mt-1 flex flex-col gap-2 p-3 bg-slate-900/95 rounded-lg border border-white/20 backdrop-blur-xl z-10 min-w-[180px] shadow-2xl">
                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: '#fef9c3' }).run();
                      setShowHighlightMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded border-2 border-white/20" style={{ backgroundColor: '#fef9c3' }} />
                    <span className="text-sm text-white">Light Yellow</span>
                  </button>

                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: '#ffe4e6' }).run();
                      setShowHighlightMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded border-2 border-white/20" style={{ backgroundColor: '#ffe4e6' }} />
                    <span className="text-sm text-white">Light Rose</span>
                  </button>

                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: '#d1fae5' }).run();
                      setShowHighlightMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded border-2 border-white/20" style={{ backgroundColor: '#d1fae5' }} />
                    <span className="text-sm text-white">Light Green</span>
                  </button>

                  <button
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: '#dbeafe' }).run();
                      setShowHighlightMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded border-2 border-white/20" style={{ backgroundColor: '#dbeafe' }} />
                    <span className="text-sm text-white">Light Blue</span>
                  </button>

                  <div className="w-full h-px bg-white/10 my-1" />

                  <button
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-left text-red-300"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Remove Highlight</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                className="p-2 rounded-lg bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20 transition-all duration-200"
                title="Text Color"
              >
                <Type className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 hidden group-hover:flex gap-1 p-2 bg-slate-900/95 rounded-lg border border-white/20 backdrop-blur-xl z-10 shadow-2xl">
                {['#000000', '#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className="w-6 h-6 rounded border-2 border-white/20 hover:border-white/60 transition-all"
                    style={{ backgroundColor: color }}
                    title={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2 border-l border-white/10 pl-2">
          <button
            onClick={onToggleAutoRead}
            className={`p-2 rounded-lg transition-all duration-200 ${isAutoReadEnabled
              ? 'bg-green-500/40 text-green-200 border border-green-400/60'
              : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white border border-white/20'
              }`}
            title={isAutoReadEnabled ? "Disable Typing Echo" : "Enable Typing Echo (Read words/sentences)"}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={onRead}
            disabled={!content}
            className="p-2 text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Read Selection or All"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onClear}
          className="px-4 py-1.5 text-sm font-medium text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/30 transition-all duration-200"
        >
          Clear
        </button>

        <button
          onClick={onSettingsClick}
          className="p-1.5 text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/30 transition-all duration-200 flex items-center justify-center"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div
        className="overflow-y-auto p-4 rounded-xl border border-white/10 backdrop-blur-sm"
        style={{
          backgroundColor: textAreaBgColor + 'E8',
          minHeight: minHeight,
          maxHeight: maxHeight,
        }}
      >
        <div
          className={`${textAreaFontSize} font-medium tracking-wide leading-relaxed`}
          style={{
            color: textAreaTextColor,
            fontFamily: textAreaFont,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
