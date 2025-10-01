import { Editor } from '@tiptap/react';
import { Bold, Italic, Code, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';
import { BubbleMenu } from '@tiptap/react/menus';

import { useSettingsStore } from 'stores/settingsStore';

const CustomBubbleMenu = ({ editor }: { editor: Editor; }) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      // tippyOptions={{ duration: 100 }}
      className={clsx(
        'flex items-center gap-1 p-2 rounded-lg shadow-lg',
        darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800 border border-gray-200',
      )}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('bold')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Bold className='w-4 h-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('italic')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Italic className='w-4 h-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('code')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Code className='w-4 h-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('underline')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <UnderlineIcon className='w-4 h-4' />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('strike')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Strikethrough className='w-4 h-4' />
      </button>
      <button
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl || 'https://');
          if (url === null) {
            return;
          }
          if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={clsx(
          'p-2 rounded-md transition-colors',
          editor.isActive('link')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <LinkIcon className='w-4 h-4' />
      </button>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;
