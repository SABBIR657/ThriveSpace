import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Toolbar from './Toolbar';

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Returns HTML
    },
  });

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="min-h-[300px] p-4 focus:outline-none" 
      />
    </div>
  );
};

export default RichTextEditor;