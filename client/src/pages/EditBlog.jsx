import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
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

  // Fetch blog data to populate form
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
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Blog</h1>

      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog Title"
          required
          className="w-full p-3 border border-gray-300 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded text-gray-600"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="content"
          rows="10"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your blog content..."
          required
          className="w-full p-3 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
}
