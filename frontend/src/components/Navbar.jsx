import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const {user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="text-xl font-bold">
            BookReviews
          </Link>
          <div className="space-x-4">
            <Link to={"/books/"} className="hover:text-blue-200">
              Books
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-blue-200">Hi, {user?.username }</span>
                <button
                  onClick={logout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={"/login/"} className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  to={"/register/"}
                  className="bg-green-500 px-3 py-1 rounded hover:bg-gray-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
