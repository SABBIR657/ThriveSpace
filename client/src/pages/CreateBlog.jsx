import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Toolbar from "../components/Toolbar";

const categories = [
  "motivation",
  "study",
  "story",
  "book",
  "Productivity",
  "Healthy Life",
  "Career",
  "Technology",
  "Inspiration",
  "Finance",
];

export default function CreateBlog() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: " ", // Default HTML content
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the placeholder feature
        heading: {
          levels: [1, 2, 3],
        },
        paragraph: {
          HTMLAttributes: {
            class: "my-2", // Add your custom paragraph styling
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1ABC9C] hover:text-[#16A085] underline",
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content: form.content,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 focus:outline-none", // Editor container styling
      },
    },
    onUpdate: ({ editor }) => {
      setForm({ ...form, content: editor.getHTML() });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post("/blogs", form);
      setSuccess("Blog posted successfully!");
      setTimeout(() => {
        navigate(`/blogs/${res.data._id}`);
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">
            Create New Post
          </h1>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Your blog title..."
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Toolbar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="min-h-[300px] p-4 bg-white focus:outline-none prose max-w-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold py-3 px-4 rounded-lg transition-colors ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  "Publish Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
