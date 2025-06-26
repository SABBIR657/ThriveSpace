import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-[#2C3E50] text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl hover:text-[#F1C40F] transition-colors">
          ThriveSpace
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-[#1ABC9C] transition-colors">Home</Link>
          {user ? (
            <>
              <span className="hidden sm:inline text-gray-300">Welcome, {user.username}</span>
              <Link 
                to="/create" 
                className="bg-[#1ABC9C] hover:bg-[#16A085] px-4 py-2 rounded transition-colors"
              >
                Create Post
              </Link>
              <button 
                onClick={logout} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-[#1ABC9C] hover:bg-[#16A085] px-4 py-2 rounded transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="border border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white px-4 py-2 rounded transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}