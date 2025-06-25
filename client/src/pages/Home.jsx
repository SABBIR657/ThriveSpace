import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";
import { FaRegThumbsUp } from "react-icons/fa";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  const [filter, setFilter] = useState("");

  const filteredBlogs = filter
    ? blogs.filter((blog) => blog.category === filter)
    : blogs;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Latest Posts
      </h1>

      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          All
        </button>
        {[
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
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            {cat}
          </button>
        ))}
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs yet.</p>
      ) : (
        filteredBlogs.map((blog) => (
          <div key={blog._id} className="border-b border-gray-200 pb-6 mb-8">
            <Link
              to={`/blogs/${blog._id}`}
              className="text-2xl font-bold text-blue-700 hover:underline"
            >
              {blog.title}
            </Link>

            <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {blog.user?.username || "Unknown"}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="h-4 w-4" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FaRegThumbsUp />
                {blog.likes?.length || 0}
              </span>
            </div>

            <p className="mt-3 text-gray-700 line-clamp-3">
              {blog.content.slice(0, 300)}...
            </p>

            <Link
              to={`/blogs/${blog._id}`}
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Read more →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
