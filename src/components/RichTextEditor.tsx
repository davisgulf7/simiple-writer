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
import { useEffect, useState } from 'react';
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
}: RichTextEditorProps) {
  const [showFormatting, setShowFormatting] = useState(false);
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
        class: 'outline-none focus:outline-none min-h-[210px]',
      },
    },
  });

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
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
        <button
          onClick={() => setShowFormatting(!showFormatting)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            showFormatting
              ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
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
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('bold')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('italic')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('underline')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'left' })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'center' })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive({ textAlign: 'right' })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('bulletList')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('orderedList')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                editor.isActive('highlight')
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 transition-all duration-200"
                title="Text Color"
              >
                <Type className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 hidden group-hover:flex gap-1 p-2 bg-slate-800/95 rounded-lg border border-white/20 backdrop-blur-xl z-10">
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

        <button
          onClick={onRead}
          disabled={!content}
          className="px-4 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Read
        </button>

        <button
          onClick={onClear}
          className="px-4 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200"
        >
          Clear
        </button>

        <button
          onClick={onSettingsClick}
          className="p-1.5 text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200 flex items-center justify-center"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div
        className="min-h-[210px] max-h-[350px] overflow-y-auto p-4 rounded-xl border border-white/10"
        style={{
          backgroundColor: textAreaBgColor + '33',
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
