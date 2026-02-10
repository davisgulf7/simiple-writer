# Rich Text Infrastructure Documentation

This document describes the rich text formatting infrastructure that has been implemented in Simple Writer.

## Overview

The application now uses **Tiptap**, a modern headless rich text editor built on ProseMirror, to support rich text formatting capabilities. The visual appearance remains unchanged, but the underlying infrastructure now supports advanced text formatting.

## Installed Packages

The following Tiptap packages have been installed:

- `@tiptap/react` - React integration for Tiptap
- `@tiptap/pm` - ProseMirror dependencies
- `@tiptap/starter-kit` - Basic extensions (bold, italic, headings, lists, etc.)
- `@tiptap/extension-placeholder` - Placeholder text support
- `@tiptap/extension-underline` - Underline formatting
- `@tiptap/extension-text-align` - Text alignment (left, center, right, justify)
- `@tiptap/extension-color` - Text color
- `@tiptap/extension-text-style` - Text style attributes
- `@tiptap/extension-highlight` - Text highlighting/background color
- `@tiptap/extension-font-family` - Font family selection

## Components

### RichTextEditor Component
**Location:** `src/components/RichTextEditor.tsx`

This component wraps the Tiptap editor and provides:
- Integration with the existing keyboard input system
- Customizable fonts, sizes, and colors
- Placeholder text support
- HTML content storage

**Props:**
- `content` - The HTML content to display
- `onChange` - Callback when content changes
- `onEditorReady` - Callback when editor is initialized
- `textAreaFont` - Font family to apply
- `textAreaFontSize` - Font size class to apply
- `textAreaTextColor` - Text color
- `textAreaBgColor` - Background color

## Enabled Features

The editor currently supports the following formatting features:

### Text Formatting
- **Bold** - Strong emphasis
- **Italic** - Emphasized text
- **Underline** - Underlined text
- **Strikethrough** - Crossed-out text

### Text Styling
- **Font Color** - Custom text colors
- **Highlight** - Background color/highlighting with multiple colors
- **Font Size** - Custom font sizes
- **Font Family** - Different font families

### Paragraph Formatting
- **Headings** - H1 through H6
- **Text Alignment** - Left, center, right, justify
- **Bullet Lists** - Unordered lists
- **Numbered Lists** - Ordered lists
- **Blockquotes** - Quoted text blocks

### Code
- **Inline Code** - Code snippets within text
- **Code Blocks** - Multi-line code blocks

### Other
- **Undo/Redo** - History management
- **Clear Formatting** - Remove all formatting

## Utility Functions

### Rich Text Helpers
**Location:** `src/utils/richTextHelpers.ts`

This file provides helper functions to programmatically apply formatting:

#### Text Formatting
- `toggleBold(editor)` - Toggle bold
- `toggleItalic(editor)` - Toggle italic
- `toggleUnderline(editor)` - Toggle underline
- `toggleStrikethrough(editor)` - Toggle strikethrough

#### Text Styling
- `setTextColor(editor, color)` - Set text color
- `setHighlight(editor, color)` - Set highlight color
- `removeHighlight(editor)` - Remove highlighting
- `setFontSize(editor, size)` - Set font size
- `setFontFamily(editor, font)` - Set font family

#### Paragraph Formatting
- `setTextAlign(editor, alignment)` - Set text alignment ('left', 'center', 'right', 'justify')
- `setHeading(editor, level)` - Set heading level (1-6)
- `setParagraph(editor)` - Convert to paragraph
- `toggleBulletList(editor)` - Toggle bullet list
- `toggleOrderedList(editor)` - Toggle numbered list
- `toggleBlockquote(editor)` - Toggle blockquote
- `toggleCodeBlock(editor)` - Toggle code block

#### Utility Functions
- `clearFormatting(editor)` - Clear all formatting
- `undo(editor)` - Undo last action
- `redo(editor)` - Redo last undone action
- `getPlainText(editor)` - Get plain text without formatting
- `getHTML(editor)` - Get HTML content
- `setContent(editor, content)` - Set content
- `clearContent(editor)` - Clear all content
- `insertText(editor, text)` - Insert text at cursor
- `isActive(editor, name, attributes)` - Check if formatting is active

### Custom Extensions

#### FontSize Extension
**Location:** `src/utils/fontSizeExtension.ts`

A custom Tiptap extension that adds font size support:
- `setFontSize(size)` - Set font size (e.g., '16px', '1.5em', '2rem')
- `unsetFontSize()` - Remove font size

## Styling

### CSS Styles
**Location:** `src/index.css`

Custom CSS styles have been added for the ProseMirror editor:
- Basic formatting styles (bold, italic, underline)
- Heading sizes and spacing
- List indentation and spacing
- Blockquote styling
- Code and code block styling
- Placeholder text styling

## Data Storage

The rich text content is stored as **HTML**. This format:
- Preserves all formatting
- Is human-readable
- Can be easily converted to plain text when needed (e.g., for text-to-speech)
- Is compatible with most databases and storage systems

## Integration with Existing Features

### Keyboard Input
The virtual keyboard now inserts content into the rich text editor using the editor's `insertContent` command.

### Text-to-Speech
The "Read" button extracts plain text from the formatted content using `editor.getText()`, ensuring proper text-to-speech functionality.

### Clear Button
The "Clear" button properly clears the editor content using `editor.commands.clearContent()`.

### Settings
All existing text area settings (font, font size, colors) continue to work and are applied to the editor container.

## Future Enhancements

To add a formatting toolbar or controls:

1. Create formatting buttons that call the helper functions from `richTextHelpers.ts`
2. Add active state indicators using `isActive()` to show which formatting is currently applied
3. Create color pickers for text color and highlighting
4. Add dropdown menus for font family and heading level selection
5. Implement keyboard shortcuts for common formatting operations

Example button implementation:
```tsx
import { toggleBold, isActive } from './utils/richTextHelpers';

<button
  onClick={() => toggleBold(editorRef.current)}
  className={isActive(editorRef.current, 'bold') ? 'active' : ''}
>
  Bold
</button>
```

## Architecture Benefits

1. **Headless Editor** - Complete control over appearance and behavior
2. **Extensible** - Easy to add new formatting features
3. **Production-Ready** - Built on battle-tested ProseMirror
4. **Programmatic Control** - Full API for automation and custom behaviors
5. **Accessibility** - Built-in accessibility features
6. **Mobile-Friendly** - Works on touch devices
7. **Collaborative-Ready** - Can be extended with real-time collaboration features

## Notes

- The editor is currently configured without a visible toolbar to maintain the existing appearance
- All formatting capabilities are available programmatically through the helper functions
- The editor automatically handles cursor position and selection
- Content updates trigger the `onChange` callback with HTML content
- The editor integrates seamlessly with React's component lifecycle
