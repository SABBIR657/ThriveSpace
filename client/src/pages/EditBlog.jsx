import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    } catch (err) {
      setError("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setForm({ ...form, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.put(`/blogs/${id}`, form);
      setSuccess("Blog updated successfully!");
      setTimeout(() => navigate(`/blogs/${res.data._id}`), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update blog");
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
              <ReactQuill
                value={form.content}
                onChange={handleContentChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                className="bg-white rounded-lg border-gray-300"
              />
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
                className="flex-1 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
