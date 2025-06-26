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
    if (!user) {
      navigate('/login', { state: { from: `/blogs/${id}` } });
      return;
    }
    try {
      await axios.patch(`/blogs/${id}/like`);
      fetchBlog();
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/blogs/${id}` } });
      return;
    }
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

  if (loading) return (
    <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
      <div className="animate-pulse text-[#2C3E50]">Loading...</div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
      <p className="text-red-500">Blog not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ECF0F1] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <span className="px-4 py-1 bg-[#F1C40F] text-[#2C3E50] text-sm font-semibold rounded-full">
              {blog.category}
            </span>
            
            {user && blog.user && user._id === blog.user._id && (
              <div className="flex gap-4">
                <Link
                  to={`/blogs/${blog._id}/edit`}
                  className="text-[#1ABC9C] hover:text-[#16A085] font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center text-sm text-gray-500 gap-6 mb-6">
            <span className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              {blog.user?.username || "Unknown"}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${blog.likes?.includes(user?._id) ? 'text-[#1ABC9C]' : 'text-gray-500 hover:text-[#1ABC9C]'}`}
            >
              {blog.likes?.includes(user?._id) ? <FaThumbsUp /> : <FaRegThumbsUp />}
              {blog.likes?.length || 0} Likes
            </button>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Comments</h2>

          {user && (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                rows="3"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent mb-4"
                required
              />
              <button
                type="submit"
                className="bg-[#1ABC9C] hover:bg-[#16A085] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </form>
          )}

          {blog.comments?.length > 0 ? (
            <ul className="space-y-6">
              {blog.comments.map((c, i) => (
                <li key={i} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-sm">
                      {c.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <p className="font-medium text-[#2C3E50]">
                      {c.username || "Anonymous"}
                    </p>
                  </div>
                  <p className="text-gray-700 pl-11">{c.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
}