import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import gsap from "gsap";
import Footer from "./Footer";

const Startpage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const floatingElementsRef = useRef(null);
  const floatingButtonRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);

    // Get username if logged in
    if (isLoggedIn) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUsername(parsedData.username || "");
      }
    }

    // GSAP Floating Elements Animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
      gsap.to(element, {
        y: Math.random() * 50 - 25,
        x: Math.random() * 50 - 25,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });
    });

    // GSAP Floating Button Animation
    gsap.to(floatingButtonRef.current, {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // GSAP Background Animation
    gsap.to(".gradient-bg", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    return () => {
      gsap.killTweensOf(".floating-element");
      gsap.killTweensOf(".gradient-bg");
      gsap.killTweensOf(floatingButtonRef.current);
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-20">
        {/* Hero Section with Animation */}
        <motion.div
          className="max-w-4xl w-full text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              {loggedIn ? `Welcome back, ${username}!` : "Welcome to Four AI"}
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            Discover the power of AI-driven voice generation. Create natural-sounding voices for your content with just a few clicks.
          </motion.p>
        </motion.div>

        {/* Animated Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            {
              title: "Easy to Use",
              description: "Simple interface designed for everyone",
              icon: "💡"
            },
            {
              title: "High Quality",
              description: "Crystal clear voice generation with AI",
              icon: "✨"
            },
            {
              title: "Customizable",
              description: "Tailor voices to fit your exact needs",
              icon: "🎛️"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="text-4xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-gray-800"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 mt-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Floating Get Started Button */}
        <motion.div
          ref={floatingButtonRef}
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
            >
              Get Started
            </motion.span>
            <motion.span
              animate={{ 
                x: [0, 5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
        
        {/* Enhanced Floating animated elements */}
        <div ref={floatingElementsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating gradient circles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="floating-element absolute rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30"
              style={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(15px)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}

          {/* Floating squares */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`square-${i}`}
              className="floating-element absolute bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              style={{
                width: Math.random() * 100 + 30,
                height: Math.random() * 100 + 30,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(10px)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}

          {/* Floating triangles */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`triangle-${i}`}
              className="floating-element absolute"
              style={{
                width: 0,
                height: 0,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderLeft: `${Math.random() * 50 + 30}px solid transparent`,
                borderRight: `${Math.random() * 50 + 30}px solid transparent`,
                borderBottom: `${Math.random() * 50 + 30}px solid rgba(147, 51, 234, 0.2)`,
                filter: 'blur(8px)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}

          {/* Floating stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="floating-element absolute text-yellow-400/30"
              style={{
                fontSize: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              ★
            </div>
          ))}

          {/* Floating lines */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="floating-element absolute bg-gradient-to-r from-blue-400/20 to-transparent"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: '2px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Startpage;
