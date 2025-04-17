/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { BsThreeDotsVertical, BsDownload } from "react-icons/bs";
import { RiSpeedLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import Navbar from "./Navbar"; // Assuming your Navbar is already designed

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState([]);

  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const presets = [
    { name: "Document Narration", icon: "📄" },
    { name: "Video Voiceover", icon: "🎥" },
    { name: "Podcast Intro", icon: "🎙" },
    { name: "Casual Conversation", icon: "💬" },
  ];

  useEffect(() => {
    const loadVoices = () => {
      if (!synthRef.current) return;
      
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices.find(v => v.default) || availableVoices[0]);
        setSelectedLanguage(availableVoices[0].lang);
      }
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  const startSpeech = () => {
    if (!synthRef.current || !selectedVoice) return;

    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.voice = selectedVoice;
    utteranceRef.current.rate = speed;
    utteranceRef.current.lang = selectedLanguage;

    utteranceRef.current.onstart = () => {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      startProgress();
    };

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setProgress(0);
      clearInterval(progressIntervalRef.current);
    };

    synthRef.current.speak(utteranceRef.current);
  };

  const startProgress = () => {
    clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      if (utteranceRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = (elapsed / utteranceRef.current.duration) * 100;
        setProgress(Math.min(progress, 100));
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      clearInterval(progressIntervalRef.current);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        startProgress();
      } else {
        startSpeech();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const stopSpeech = () => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    setIsPlaying(false);
    setProgress(0);
    clearInterval(progressIntervalRef.current);
  };

  const handleDownload = () => {
    alert("Audio download feature would require server-side processing");
  };

  const playVoicePreview = (voice) => {
    if (!synthRef.current) return;
    
    const previewUtterance = new SpeechSynthesisUtterance(voice.name);
    previewUtterance.voice = voice;
    synthRef.current.speak(previewUtterance);
  };

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar fixed to the top */}
      <Navbar />

      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] pt-2 px-4"> {/* Added pt-24 for spacing */}
        {/* Main Content */}
        <motion.div
          className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-8"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Text Input */}
          <div className="relative mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 resize-none shadow-lg"
            />
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
              {text.length}/5000 characters
            </div>
          </div>

          {/* Controls */}
          <motion.div
            className="mt-6 flex flex-wrap gap-4 items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3 items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded-lg py-2 px-4 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {[...new Set(voices.map(v => v.lang))].map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                className="border rounded-lg py-2 px-4 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="border rounded-lg p-2 hover:bg-gray-200"
                >
                  <BsThreeDotsVertical className="text-xl" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2">
                    <div className="flex items-center gap-2 p-2">
                      <RiSpeedLine />
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm">{speed}x</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                onClick={togglePlayPause}
                whileHover={{ scale: 1.1 }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </motion.button>
              <motion.button
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg"
                onClick={stopSpeech}
                whileHover={{ scale: 1.1 }}
              >
                <FaStop />
              </motion.button>
              <motion.button
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg"
                onClick={handleDownload}
                whileHover={{ scale: 1.1 }}
              >
                <BsDownload />
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

          {/* Voice Selection */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Select Voice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voices.map((voice) => (
                <motion.div
                  key={voice.name}
                  className={`p-4 border rounded-xl cursor-pointer shadow-lg transition-all ${
                    selectedVoice?.name === voice.name
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelectedVoice(voice)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{voice.name}</h4>
                      <p className="text-sm text-gray-500">{voice.lang}</p>
                    </div>
                    <motion.button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePreview(voice);
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaPlay />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Presets */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Use Case Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {presets.map((preset) => (
                <motion.button
                  key={preset.name}
                  className="p-4 border rounded-xl hover:border-blue-400 transition-all text-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-xl">{preset.icon}</div>
                  <div className="mt-2 text-sm">{preset.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TextToSpeech;
