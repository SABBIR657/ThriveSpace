import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";
import { FaRegThumbsUp } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const filteredBlogs = filter
    ? blogs.filter((blog) => blog.category === filter)
    : blogs;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `/blogs${search ? `?search=${search}` : ""}`
        );
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#2C3E50]">
          Latest Posts
        </h1>

        <SearchBar />

        <div className="mb-8 flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "" 
                ? "bg-[#2C3E50] text-white" 
                : "bg-white text-[#2C3E50] hover:bg-gray-100"
            }`}
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat 
                  ? "bg-[#1ABC9C] text-white" 
                  : "bg-white text-[#2C3E50] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found.</p>
            <Link 
              to="/create" 
              className="mt-4 inline-block bg-[#1ABC9C] hover:bg-[#16A085] text-white px-6 py-2 rounded transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog._id} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-[#F1C40F] text-[#2C3E50] text-xs font-semibold rounded-full">
                    {blog.category}
                  </span>
                </div>
                
                <Link to={`/blogs/${blog._id}`}>
                  <h2 className="text-2xl font-bold text-[#2C3E50] hover:text-[#1ABC9C] transition-colors">
                    {blog.title}
                  </h2>
                </Link>

                <div className="flex items-center text-sm text-gray-500 mt-3 gap-4">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {blog.user?.username || "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegThumbsUp />
                    {blog.likes?.length || 0} likes
                  </span>
                </div>

                <p className="mt-4 text-gray-700 line-clamp-3 leading-relaxed">
                  {blog.content.slice(0, 300)}...
                </p>

                <Link
                  to={`/blogs/${blog._id}`}
                  className="mt-4 inline-block text-[#1ABC9C] hover:text-[#16A085] font-medium transition-colors"
                >
                  Continue reading →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}