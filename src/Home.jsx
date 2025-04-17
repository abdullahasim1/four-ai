import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import VoiceGenerator from "./VoiceGenerator";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaUserCircle } from "react-icons/fa"; // Profile icon

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
    console.log("Login status:", isLoggedIn); // Debugging output
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-blue-600 text-white text-center py-10 px-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold animate-pulse">
          Welcome to Four AI
        </h1>
        <p className="text-md md:text-lg mt-2">
          AI-powered voice generation made simple.
        </p>
        
        {/* Conditional rendering for Login/SignUp buttons */}
        {!loggedIn && (
          <Link
            to="/login"
            className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 md:py-3 rounded-lg text-md md:text-lg font-bold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        )}
      </motion.header>

      {/* Voice Generator */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
        className="px-4"
      >
        <VoiceGenerator />
      </motion.div>

      {/* Voice Library Section */}
      <motion.section
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="bg-gray-100 py-10 px-4"
      >
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Text Section */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold">
                Elevate your creative projects with Voice Library
              </h1>
              <p className="text-md md:text-lg text-gray-700 mt-4">
                Discover a vast collection of high-quality voices tailored for
                creators.
              </p>
              <a
                href="/voice-library"
                className="mt-4 inline-block px-4 md:px-6 py-2 md:py-3 bg-black text-white text-md md:text-lg font-bold rounded-lg hover:bg-gray-800 transition"
              >
                EXPLORE VOICE LIBRARY
              </a>
            </motion.div>

            {/* Voice Cards Section */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                {
                  title: "Carter’s Edge ⚙",
                  listens: "17.8m",
                  users: "3.7k",
                  description: "A rugged & masculine man's voice...",
                },
                {
                  title: "Carter Motivational ⚙",
                  listens: "5.4m",
                  users: "1.1k",
                  description: "A commanding voice for motivation...",
                },
              ].map((voice, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900 text-white p-4 rounded-lg shadow-md"
                >
                  <h5 className="text-lg font-bold">{voice.title}</h5>
                  <p className="text-gray-300 mt-2">{voice.description}</p>
                  <p className="text-gray-400 mt-2 text-sm">
                    🎙 {voice.listens} 👤 {voice.users}
                  </p>
                  <button className="mt-4 w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
                    Save to My Voices
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="container mx-auto py-12 px-4 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: "High-Quality AI Voices", text: "Generate natural-sounding speech." },
            { title: "AI Voice Generation", text: "Generate high-quality, natural-sounding voices using advanced AI technology." },
            { title: "Customizable Voices", text: "Adjust voice styles, tones, and emotions to suit your needs." },
            { title: "Easy Integration", text: "Seamlessly integrate our API into your applications with comprehensive documentation." },
            { title: "Scalable Solutions", text: "Our platform scales with your needs, from small projects to enterprise-level applications." },
            { title: "Real-Time Processing", text: "Experience fast and real-time voice generation for dynamic applications." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-md">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="bg-gray-200 text-center py-12 px-4"
      >
        <h2 className="text-xl md:text-2xl font-bold">
          Start Creating AI Voices Today
        </h2>
        <p className="text-md md:text-lg mt-2">
          Join thousands of users leveraging AI for voice generation.
        </p>
        <Link
          to="/signup"
          className="mt-4 inline-block bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-md md:text-lg font-bold hover:bg-blue-700 transition"
        >
          Sign Up Now
        </Link>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="bg-white-900 text-white text-center py-4"
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default Home;
