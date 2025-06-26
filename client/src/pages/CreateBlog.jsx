import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    content: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/blogs", form);
      setSuccess("Blog posted successfully!");
      setTimeout(() => {
        navigate(`/blogs/${res.data._id}`);
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post blog");
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
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog content..."
                required
                rows={12}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}