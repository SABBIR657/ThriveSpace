import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        ThriveSpace
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span className="hidden sm:inline">Hello, {user.username}</span>
            <Link to="/create">Create</Link>
            <button onClick={logout} className="hover:underline text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
