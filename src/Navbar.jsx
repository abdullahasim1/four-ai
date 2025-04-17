import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImage from "./assets/images/profile-user.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("User");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLogged);

    // Get username from userData if available
    if (isLogged) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUsername(parsedData.username || "User");
      }
    }

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("userData");
    setLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/home");
  };

  const navigation = [
    { title: "Home", path: "/home" },
    { title: "Features", path: "/features" },
    { title: "Team", path: "/team" },
    { title: "Pricing", path: "/pricing" },
  ];

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50 min-h">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          <img src="./src/assets/images/logo.png" alt="Logo" height={100} width={40} />
          
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navigation.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="text-gray-700 hover:text-blue-500"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right Side User Controls */}
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none"
              >
                <img
                  src={profileImage}
                  className="w-10 h-10 rounded-full border"
                  alt="Avatar"
                />
              </button>

              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-50">
                  <li className="flex items-center gap-2 p-4 border-b">
                    <img
                      src={profileImage}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div>
                      <h6 className="font-semibold text-gray-800">
                        Hi {username}
                      </h6>
                      <p className="text-sm text-gray-500"></p>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navigation.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
; 