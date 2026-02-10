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
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady?: (editor: any) => void;
  textAreaFont: string;
  textAreaFontSize: string;
  textAreaTextColor: string;
  textAreaBgColor: string;
}

export default function RichTextEditor({
  content,
  onChange,
  onEditorReady,
  textAreaFont,
  textAreaFontSize,
  textAreaTextColor,
  textAreaBgColor,
}: RichTextEditorProps) {
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

  return (
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
  );
}
