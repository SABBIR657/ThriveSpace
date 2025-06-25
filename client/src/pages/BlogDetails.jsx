import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

export default function BlogDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error("Failed to fetch blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like the post.");
    try {
      await axios.patch(`/blogs/${id}/like`);
      fetchBlog();
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required to comment.");
    try {
      await axios.post(`/blogs/${id}/comment`, { text: comment });
      setComment("");
      fetchBlog();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/blogs/${id}`);
      navigate("/");
    } catch (err) {
      alert("Error deleting blog.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!blog)
    return <p className="text-center mt-10 text-red-500">Blog not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{blog.title}</h1>

      {user && blog.user && user._id === blog.user._id && (
        <div className="flex gap-4 mb-6">
          <Link
            to={`/blogs/${blog._id}/edit`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-500 gap-4 mb-6">
        <span className="flex items-center gap-1">
          <UserIcon className="h-4 w-4" />
          {blog.user?.username || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDaysIcon className="h-4 w-4" />
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          {blog.likes?.includes(user?._id) ? <FaThumbsUp /> : <FaRegThumbsUp />}
          {blog.likes?.length || 0}
        </button>
      </div>

      <div className="prose prose-lg max-w-none mb-8 text-gray-800">
        {blog.content}
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {user && (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              rows="3"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>
        )}

        {blog.comments?.length > 0 ? (
          <ul className="space-y-4">
            {blog.comments.map((c, i) => (
              <li key={i} className="bg-gray-100 p-3 rounded">
                <p className="text-sm font-semibold">
                  {c.username || "Anonymous"}
                </p>
                <p className="text-gray-700">{c.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
