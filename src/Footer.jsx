import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaYoutube, FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-100 text-gray-800 py-12 mt-10"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {/* Research Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">RESEARCH</h3>
            <ul className="space-y-2">
              <li className="hover:translate-x-2 transition">Text to Speech</li>
              <li className="hover:translate-x-2 transition">Speech to Text</li>
              <li className="hover:translate-x-2 transition">Speech to Speech</li>
              <li className="hover:translate-x-2 transition">Text to Sound Effects</li>
              <li className="hover:translate-x-2 transition">Voice Cloning</li>
              <li className="hover:translate-x-2 transition">Voice Isolator</li>
            </ul>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">PRODUCTS</h3>
            <ul className="space-y-2">
              <li className="hover:translate-x-2 transition">Projects</li>
              <li className="hover:translate-x-2 transition">Conversational AI</li>
              <li className="hover:translate-x-2 transition">Dubbing Studio</li>
              <li className="hover:translate-x-2 transition">Audio Native</li>
              <li className="hover:translate-x-2 transition">FourStudios</li>
              <li className="hover:translate-x-2 transition">API</li>
              <li className="hover:translate-x-2 transition">Voiceover Studio</li>
              <li className="hover:translate-x-2 transition">FourReader</li>
            </ul>
          </div>

          {/* Solutions Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">SOLUTIONS</h3>
            <ul className="space-y-2">
              <li className="hover:translate-x-2 transition">For Enterprise</li>
              <li className="hover:translate-x-2 transition">For Teams</li>
              <li className="hover:translate-x-2 transition">For Creators</li>
              <li className="hover:translate-x-2 transition">For Developers</li>
              <li className="hover:translate-x-2 transition">For Startups</li>
              <li className="hover:translate-x-2 transition">Publishing</li>
              <li className="hover:translate-x-2 transition">Media & Entertainment</li>
              <li className="hover:translate-x-2 transition">Conversational AI</li>
            </ul>
          </div>

          {/* Resources & Company */}
          <div>
            <h3 className="text-lg font-semibold mb-3">RESOURCES</h3>
            <ul className="space-y-2">
              <li className="hover:translate-x-2 transition">API Reference</li>
              <li className="hover:translate-x-2 transition">Product Guides</li>
              <li className="hover:translate-x-2 transition">Help Centre</li>
              <li className="hover:translate-x-2 transition">Languages</li>
              <li className="hover:translate-x-2 transition">Webinars</li>
              <li className="hover:translate-x-2 transition">Discord</li>
            </ul>
            <h3 className="text-lg font-semibold mt-5 mb-3">COMPANY</h3>
            <ul className="space-y-2">
              <li className="hover:translate-x-2 transition">About</li>
              <li className="hover:translate-x-2 transition">Safety</li>
              <li className="hover:translate-x-2 transition">Careers</li>
              <li className="hover:translate-x-2 transition">Blog</li>
              <li className="hover:translate-x-2 transition">Impact Program</li>
              <li className="hover:translate-x-2 transition">Brand & Press Kit</li>
              <li className="hover:translate-x-2 transition">Iconic Voices</li>
            </ul>
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center space-x-6 mt-10"
        >
          <a href="#" className="text-gray-600 hover:text-gray-900 transition">
            <FaLinkedin size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition">
            <FaYoutube size={24} />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition">
            <FaDiscord size={24} />
          </a>
        </motion.div>

        {/* Copyright & Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-6 text-gray-500"
        >
          <p>© 2025 Four AI. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Safety</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
