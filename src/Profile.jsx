import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import profileImage from "./assets/images/profile-user.png";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser({
        name: parsedData.username || "User",
        email: parsedData.email || "",
        profilePic: profileImage, // Use default image if no profile pic is available
      });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Animated Profile Card */}
      <main className="flex-grow flex justify-center items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.img
              src={user.profilePic || profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-indigo-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            />
            <motion.h2
              className="text-2xl font-bold text-gray-800"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {user.name}
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {user.email}
            </motion.p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
