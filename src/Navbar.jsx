import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import profileImage from "./assets/images/profile-user.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("User");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Check authentication status on component mount and page refresh
    const checkAuthStatus = () => {
      const isLogged = localStorage.getItem("loggedIn") === "true";
      setLoggedIn(isLogged);

      if (isLogged) {
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            setUsername(parsedData.username || "User");
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("userData");
            localStorage.setItem("loggedIn", "false");
            setLoggedIn(false);
          }
        }
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.setItem("loggedIn", "false");
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
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="./src/assets/images/logo.png " 
            alt="Logo" height={100} width={50}
            className="h-4 w-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navigation.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`text-gray-700 hover:text-blue-500 py-5 border-b-2 ${
                location.pathname === item.path
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Right Side User Controls */}
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <>
              <Link 
                to="/login" 
                className="hidden md:block text-gray-700 hover:text-blue-600 font-medium"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none flex items-center gap-2"
              >
                <img
                  src={profileImage}
                  className="w-8 h-8 rounded-full border"
                  alt="Avatar"
                />
                <span className="hidden md:block text-gray-700">{username}</span>
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
            className="md:hidden text-gray-700 focus:outline-none"
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
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white border-t shadow-lg">
          <div className="space-y-3">
            {navigation.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`block py-2 text-base ${
                  location.pathname === item.path
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {!loggedIn && (
              <Link
                to="/login"
                className="block py-2 text-base text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
