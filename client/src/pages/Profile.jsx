import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const { user } = useAuth();
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get(`/blogs/user/${user._id}`);
        setUserBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch user blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserBlogs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] flex items-center justify-center">
        <div className="animate-pulse text-[#2C3E50]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF0F1] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="h-20 w-20 rounded-full bg-[#1ABC9C] flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2C3E50]">
                  {user.username}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
                About Me
              </h2>
              <p className="text-gray-700">
                {user.bio || "No bio information available."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">
              My Posts ({userBlogs.length})
            </h2>

            {userBlogs.length > 0 ? (
              <div className="space-y-6">
                {userBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/blogs/${blog._id}`}
                        className="text-xl font-semibold text-[#1ABC9C] hover:text-[#16A085]"
                      >
                        {blog.title}
                      </Link>
                      <span className="px-3 py-1 bg-[#F1C40F] text-[#2C3E50] text-xs font-semibold rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <p className="text-gray-700 line-clamp-2">
                      {blog.content.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't posted any blogs yet.</p>
                <Link
                  to="/create"
                  className="inline-block bg-[#1ABC9C] hover:bg-[#16A085] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}