import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { BsMic, BsCameraVideo } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const VoiceGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState(
    "The Four AI voice generator can deliver high-quality, human-like speech in 32 languages. Perfect for audiobooks, video voiceovers, commercials, and more."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Brian");
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const voices = ["Brian", "Emma", "Olivia", "James", "Sophia", "Daniel", "Liam"];
  const languages = ["English", "Spanish", "French", "German", "Italian", "Chinese", "Japanese"];

  return (
    <div className="container mx-auto mt-10 px-4">
      

      {/* Top Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
  {[
    { label: "TEXT TO SPEECH", route: "/texttospeech" },
    { label: "VOICE CHANGER", route: "/voicechanger" },
    { label: "TEXT TO IMAGE", route: "/imagegenerator" },
  ].map((btn, index) => (
    <button
      key={index}
      className="border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      onClick={() => navigate(btn.route)}
    >
      {btn.label}
    </button>
  ))}
</div>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        {/* Editable Text */}
        {isEditing ? (
          <textarea
            className="w-full border rounded-lg p-3 focus:ring focus:ring-gray-300"
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <p className="text-lg cursor-pointer hover:text-gray-600" onClick={() => setIsEditing(true)}>
            {text}
          </p>
        )}

        {/* Language & Options */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              🌐 {selectedLanguage} <IoMdArrowDropdown />
            </button>

            {showLanguageDropdown && (
              <div className="absolute bg-white border shadow-lg rounded-lg mt-2 z-10 w-40">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span> &gt; </span>
          <button
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            onClick={() => alert("Tell a Story")}
          >
            📖 TELL A STORY
          </button>
          <button
            className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition"
            onClick={() => alert("Introduce a Podcast")}
          >
            <BsMic /> INTRODUCE A PODCAST
          </button>
          <button
            className="border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition"
            onClick={() => alert("Create a Video Voiceover")}
          >
            <BsCameraVideo /> CREATE A VIDEO VOICEOVER
          </button>
        </div>

        {/* Voice Selection */}
        <div className="flex justify-between items-center mt-4">
          <div className="relative">
            <button
              className="border border-gray-300 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition"
              onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
            >
              🎤 {selectedVoice} <IoMdArrowDropdown />
            </button>

            {showVoiceDropdown && (
              <div className="absolute bg-white border shadow-lg rounded-lg mt-2 z-10 w-40">
                {voices.map((voice) => (
                  <div
                    key={voice}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedVoice(voice);
                      setShowVoiceDropdown(false);
                    }}
                  >
                    {voice}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-gray-600">156/500</span>
            <button
              className="bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => alert("Playing Audio")}
            >
              <FaPlay />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="text-center mt-6">
        <p className="font-bold text-lg">EXPERIENCE THE FULL AUDIO AI PLATFORM</p>
        <button
          className="mt-3 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          onClick={() => alert("Try for Free")}
        >
          TRY FOR FREE
        </button>
      </div>
    </div>
  );
};

export default VoiceGenerator;






