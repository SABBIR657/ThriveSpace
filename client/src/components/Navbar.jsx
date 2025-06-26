import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#2C3E50] text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl hover:text-[#F1C40F] transition-colors">
          ThriveSpace
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-[#1ABC9C] transition-colors whitespace-nowrap">
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/create" 
                className="bg-[#1ABC9C] hover:bg-[#16A085] px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                Create Post
              </Link>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-[#1ABC9C] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-gray-300 whitespace-nowrap">
                    {user.username}
                  </span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-[#1ABC9C] hover:text-white"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#1ABC9C] hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-[#1ABC9C] hover:bg-[#16A085] px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="border border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
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