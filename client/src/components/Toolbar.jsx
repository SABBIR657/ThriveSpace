export default function Toolbar({ editor }) {
  if (!editor) return null;

  const handleEditorAction = (action) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50"
      onClick={(e) => e.preventDefault()}
    >
      {/* Text Formatting */}
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().toggleBold().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("bold")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Bold"
        type="button"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().toggleItalic().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("italic")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Italic"
        type="button"
      >
        <em>I</em>
      </button>
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().toggleUnderline().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("underline")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Underline"
        type="button"
      >
        <u>U</u>
      </button>

      {/* Headings */}
      <select
        onChange={(e) => {
          e.preventDefault();
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
        className="p-2 border rounded bg-white"
        value={
          editor.isActive("heading", { level: 1 })
            ? 1
            : editor.isActive("heading", { level: 2 })
            ? 2
            : editor.isActive("heading", { level: 3 })
            ? 3
            : 0
        }
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      {/* Lists */}
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().toggleBulletList().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("bulletList")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Bullet List"
        type="button"
      >
        • List
      </button>
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        className={`p-2 rounded ${
          editor.isActive("orderedList")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Numbered List"
        type="button"
      >
        1. List
      </button>

      {/* Links & Images */}
      <button
        onClick={handleEditorAction(handleLink)}
        className={`p-2 rounded ${
          editor.isActive("link")
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Link"
        type="button"
      >
        Link
      </button>
      <button
        onClick={handleEditorAction(addImage)}
        className="p-2 rounded hover:bg-gray-200"
        title="Image"
        type="button"
      >
        Image
      </button>

      {/* Alignment */}
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().setTextAlign("left").run()
        )}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "left" })
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Align Left"
        type="button"
      >
        ≡
      </button>
      <button
        onClick={handleEditorAction(() =>
          editor.chain().focus().setTextAlign("center").run()
        )}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "center" })
            ? "bg-[#1ABC9C] text-white"
            : "hover:bg-gray-200"
        }`}
        title="Align Center"
        type="button"
      >
        ≡
      </button>
    </div>
  );
}
