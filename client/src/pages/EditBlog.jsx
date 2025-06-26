import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Toolbar from '../components/Toolbar';

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

export default function EditBlog() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#1ABC9C] hover:text-[#16A085] underline',
        },
      }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm({ ...form, content: editor.getHTML() });
    },
  });

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${id}`);
      if (res.data.user._id !== user._id) {
        setError("Unauthorized to edit this blog");
        return;
      }
      setForm({
        title: res.data.title,
        category: res.data.category,
        content: res.data.content,
      });
      // Set editor content once it's available
      if (editor) {
        editor.commands.setContent(res.data.content);
      }
    } catch (err) {
      setError("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // Update editor content when form.content changes
  useEffect(() => {
    if (editor && form.content !== editor.getHTML()) {
      editor.commands.setContent(form.content);
    }
  }, [form.content, editor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.put(`/blogs/${id}`, form);
      setSuccess("Blog updated successfully!");
      setTimeout(() => navigate(`/blogs/${res.data._id}`), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <div className="animate-pulse text-[#2C3E50]">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#ECF0F1] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">
            Edit Post
          </h1>

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
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
                placeholder="Blog Title"
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

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-[#2C3E50] text-[#2C3E50] hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}