import { useState, useEffect } from 'react';

import clsx from 'clsx';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

import { useSettingsStore } from 'stores/settingsStore';

import CustomBubbleMenu from 'components/Shared/CustomBubbleMenu';
import CustomFloatingMenu from 'components/Shared/CustomFloatingMenu';

type EditorFieldPropsType = {
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string;
  className?: string;
};

const EditorField = ({ value, onChange, placeholder, className }: EditorFieldPropsType) => {
  const [isFocused, setIsFocused] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  // Create editor instance with StarterKit and custom configuration
  const editor = useEditor({
    extensions: [
      Typography,
      TextStyle,
      Color,
      Highlight,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something…',
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      HorizontalRule,
      StarterKit.configure({

        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: clsx(
              'p-4 rounded-lg my-2',
              darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800',
            ),
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'my-1',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: clsx(
              'border-l-4 pl-4 py-2 my-2',
              darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700',
            ),
          },
        },
      }),
    ],
    content: value,
    editorProps: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find((i) => i.type.startsWith('image/'))?.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result && typeof reader.result === 'string') {
              view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: reader.result })));
            }
          };
          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
    },
    autofocus: false,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={clsx('relative', className)}>
      {/* Placeholder */}
      {placeholder && !editor?.getText() && !isFocused && (
        <div
          className={clsx(
            'absolute top-3 left-3 pointer-events-none',
            darkMode ? 'text-gray-500' : 'text-gray-400',
          )}
        >
          {placeholder}
        </div>
      )}

      <EditorContent
        editor={editor}
        className={clsx(
          'min-h-[100px] w-full rounded-lg border p-3 focus:outline-none focus:ring-2 transition-colors',
          darkMode
            ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-purple-500'
            : 'border-gray-300 bg-white text-gray-800 focus:ring-purple-500',
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {editor && <CustomBubbleMenu editor={editor} />}

      {editor && <CustomFloatingMenu editor={editor} />}
    </div>
  );
};

export default EditorField;
