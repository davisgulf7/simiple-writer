import type { Editor } from '@tiptap/react';

export const toggleBold = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleBold().run();
};

export const toggleItalic = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleItalic().run();
};

export const toggleUnderline = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleUnderline().run();
};

export const toggleStrikethrough = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleStrike().run();
};

export const setTextColor = (editor: Editor | null, color: string) => {
  if (!editor) return;
  editor.chain().focus().setColor(color).run();
};

export const setHighlight = (editor: Editor | null, color: string) => {
  if (!editor) return;
  editor.chain().focus().setHighlight({ color }).run();
};

export const removeHighlight = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().unsetHighlight().run();
};

export const setFontSize = (editor: Editor | null, size: string) => {
  if (!editor) return;
  editor.chain().focus().setFontSize(size).run();
};

export const setFontFamily = (editor: Editor | null, font: string) => {
  if (!editor) return;
  editor.chain().focus().setFontFamily(font).run();
};

export const setTextAlign = (editor: Editor | null, alignment: 'left' | 'center' | 'right' | 'justify') => {
  if (!editor) return;
  editor.chain().focus().setTextAlign(alignment).run();
};

export const setHeading = (editor: Editor | null, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  if (!editor) return;
  editor.chain().focus().setHeading({ level }).run();
};

export const setParagraph = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().setParagraph().run();
};

export const toggleBulletList = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleBulletList().run();
};

export const toggleOrderedList = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleOrderedList().run();
};

export const toggleBlockquote = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleBlockquote().run();
};

export const toggleCodeBlock = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().toggleCodeBlock().run();
};

export const clearFormatting = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().clearNodes().unsetAllMarks().run();
};

export const undo = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().undo().run();
};

export const redo = (editor: Editor | null) => {
  if (!editor) return;
  editor.chain().focus().redo().run();
};

export const getPlainText = (editor: Editor | null): string => {
  if (!editor) return '';
  return editor.getText();
};

export const getHTML = (editor: Editor | null): string => {
  if (!editor) return '';
  return editor.getHTML();
};

export const setContent = (editor: Editor | null, content: string) => {
  if (!editor) return;
  editor.commands.setContent(content);
};

export const clearContent = (editor: Editor | null) => {
  if (!editor) return;
  editor.commands.clearContent();
};

export const insertText = (editor: Editor | null, text: string) => {
  if (!editor) return;
  editor.commands.insertContent(text);
};

export const isActive = (editor: Editor | null, name: string, attributes?: Record<string, any>): boolean => {
  if (!editor) return false;
  return editor.isActive(name, attributes);
};
