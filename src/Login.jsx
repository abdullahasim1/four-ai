import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Track checkbox state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Make API request to login
      const res = await axios.post("http://localhost:5000/login", { email, password });

      // Set token in localStorage
      localStorage.setItem("token", res.data.token);

      // Store user data in localStorage
      if (res.data.user) {
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      // Optionally, handle the "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem("loggedIn", "true");
      }

      // Set loggedIn status in localStorage (so Navbar knows about it)
      localStorage.setItem("loggedIn", "true");

      alert("Login successful!");
      navigate("/home"); // Redirect to home page after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-sm w-full text-gray-600 space-y-5 bg-white shadow-lg rounded-lg p-8"
      >
        <div className="text-center pb-8">
          <motion.h3
            className="text-gray-800 text-2xl font-bold sm:text-3xl mt-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Log in to your account
          </motion.h3>
        </div>

        <motion.form
          onSubmit={handleLogin}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div whileFocus={{ scale: 1.05 }}>
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition-all"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }}>
            <label className="font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition-all"
            />
          </motion.div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="remember-me-checkbox"
                className="w-5 h-5 cursor-pointer"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label
                htmlFor="remember-me-checkbox"
                className="text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-center text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Sign in
          </motion.button>
        </motion.form>

        <p className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </motion.div>
    </main>
  );
};

export default Login;
