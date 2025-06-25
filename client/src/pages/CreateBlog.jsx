import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReactQuill from "react-quill";

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

    console.log("sending:", form);
    try {
      const res = await axios.post("/blogs", form);

      setSuccess("Blog posted successfully!");
      setTimeout(() => {
        navigate(`/blogs/${res.data._id}`);
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post blog");
      // console.error("Error response:", err?.response?.data || err.message);
      // setError("Failed to post blog. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">Write a Blog</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

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
          Publish
        </button>
      </form>
    </div>
  );
}
