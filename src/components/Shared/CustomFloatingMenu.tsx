import { Editor } from '@tiptap/react';
import { Hash, List, ListOrdered, Code, Quote } from 'lucide-react';
import clsx from 'clsx';
import { FloatingMenu } from '@tiptap/react/menus';

import { useSettingsStore } from 'stores/settingsStore';

const CustomFloatingMenu = ({ editor }: { editor: Editor; }) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  if (!editor) {
    return null;
  }

  return (
    <FloatingMenu
      shouldShow={({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        // Show only if current paragraph is empty
        return $from.parent.content.size === 0;
      }}
      editor={editor}
      // tippyOptions={{ duration: 100 }}
      className={clsx(
        'flex flex-wrap gap-1 p-2 rounded-lg shadow-lg max-w-xs',
        darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800 border border-gray-200',
      )}
    >
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('heading', { level: 1 })
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Hash className='w-4 h-4' />
        <span>H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('heading', { level: 2 })
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Hash className='w-4 h-4' />
        <span>H2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('heading', { level: 3 })
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Hash className='w-4 h-4' />
        <span>H3</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('bulletList')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <List className='w-4 h-4' />
        <span>Bullet</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('orderedList')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <ListOrdered className='w-4 h-4' />
        <span>Number</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('codeBlock')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Code className='w-4 h-4' />
        <span>Code</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={clsx(
          'p-2 rounded-md transition-colors text-sm',
          editor.isActive('blockquote')
            ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
            : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'),
        )}
        type='button'
      >
        <Quote className='w-4 h-4' />
        <span>Quote</span>
      </button>
    </FloatingMenu>
  );
};

export default CustomFloatingMenu;
