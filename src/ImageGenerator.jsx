import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Api from "./api";
import Navbar from "./Navbar";

const ImageGen = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt!");

    setLoading(true);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${Api}`,
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.jpg";
    link.click();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      < Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6"
        >
          ImagePrompt <span className="text-indigo-400">AI</span>
        </motion.h1>

        {/* Image Display */}
        <motion.div
          className="relative w-96 h-96 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden bg-gray-800"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400"></div>
          ) : image ? (
            <motion.img
              src={image}
              alt="Generated"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            />
          ) : (
            <p className="text-gray-400">Your AI-generated image will appear here.</p>
          )}
        </motion.div>

        {/* Input & Buttons */}
        <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-md">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                prompt ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={generateImage}
              disabled={!prompt}
            >
              {loading ? "Generating..." : "Generate"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                image ? "bg-green-500 hover:bg-green-600" : "bg-gray-700 cursor-not-allowed"
              }`}
              onClick={handleDownload}
              disabled={!image}
            >
              Download
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-gray-500">
          © <span className="text-indigo-400">Four AI</span> | Developed by Four AI
        </p>
      </div>
    </div>
  );
};

export default ImageGen;
