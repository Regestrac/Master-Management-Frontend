import { useEffect } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useController } from 'react-hook-form';

type EditorFieldPropsType = {
  placeholder?: string;
  name: string;
};

const EditorField = ({ placeholder = 'Add a description...', name }: EditorFieldPropsType) => {
  const { field } = useController({ name });

  const editor = useEditor({
    content: field.value,
    editable: true,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      field.onChange(html);
    },
  });

  // Sync external changes
  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value);
    }
  }, [editor, field.value]);

  if (!editor) { return null; }

  const buttonClass = (isActive: boolean) =>
    `px-2 py-1 text-sm border rounded mr-1 ${isActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
    } hover:bg-blue-100`;

  return (
    <div>
      {/* Toolbar */}
      <div className='mb-2 flex flex-wrap gap-1'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive('bold'))}
        >
          Bold
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive('italic'))}
        >
          Italic
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive('bulletList'))}
        >
          Bullet List
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive('orderedList'))}
        >
          Numbered List
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={buttonClass(editor.isActive('paragraph'))}
        >
          Paragraph
        </button>
      </div>

      {/* Editor Content */}
      <div className='border rounded-md min-h-[120px] p-3 focus-within:border-blue-500 transition-all'>
        <EditorContent
          editor={editor}
          className='prose max-w-none outline-none'
        />
      </div>
    </div>
  );
};

export default EditorField;
