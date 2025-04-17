import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      setMessage('');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });

      if (response.data.message) {
        setMessage(response.data.message);
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full flex">
      {/* Left Side - Animated */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative flex-1 hidden items-center justify-center h-screen bg-black lg:flex"
      >
        <div className="relative z-10 w-full max-w-md">
          <img src="" width={150} alt="Logo" />
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black text-white text-3xl font-bold mt-16"
          >
            Start growing your business quickly
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300"
          >
            Create an account and get access to all features for 30 days. No credit card required.
          </motion.p>
          <motion.div
            className="flex items-center -space-x-2 overflow-hidden mt-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="user-1"
            />
            <img
              src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="user-2"
            />
            <img
              src="https://randomuser.me/api/portraits/men/86.jpg"
              className="w-10 h-10 rounded-full border-2 border-white"
              alt="user-3"
            />
            <p className="text-sm text-gray-400 font-medium translate-x-5">
              Join 5,000+ users
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex items-center justify-center h-screen"
      >
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-800 text-2xl font-bold sm:text-3xl"
            >
              Sign up
            </motion.h3>
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Signup Form */}
          <motion.form
            onSubmit={handleSignup}
            className="space-y-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Name Field */}
            <motion.div className="relative flex items-center">
              <FaUser className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div className="relative flex items-center">
              <FaEnvelope className="absolute left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div className="relative flex items-center">
              <FaLock className="absolute left-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition-all"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </motion.button>

            {/* Messages */}
            {message && <p className="text-center text-green-600 mt-2">{message}</p>}
            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </motion.form>
        </div>
      </motion.div>
    </main>
  );
};

export default SignupPage;
