import React, { useState, useRef } from "react";
import Navbar from "./Navbar"; // Import the Navbar component

const VoiceChanger = () => {
  const [file, setFile] = useState(null);
  const [effect, setEffect] = useState("normal");
  // eslint-disable-next-line no-unused-vars
  const [audioUrl, setAudioUrl] = useState(null);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)()).current;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEffectChange = (e) => {
    setEffect(e.target.value);
  };

  const handleApplyEffect = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const audioBuffer = event.target.result;

        audioContext.decodeAudioData(audioBuffer, (buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;

          const effectNode = applyEffect(effect);

          source.connect(effectNode);
          effectNode.connect(audioContext.destination);

          source.start();
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const applyEffect = (effect) => {
    const effectNode = audioContext.createGain();
  
    switch (effect) {
      case "robot": {
        const pitchShift = audioContext.createGain();
        pitchShift.gain.setValueAtTime(2, audioContext.currentTime);
        return pitchShift;
      }
      case "slow": {
        const slowNode = audioContext.createGain();
        slowNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        return slowNode;
      }
      case "fast": {
        const fastNode = audioContext.createGain();
        fastNode.gain.setValueAtTime(1.5, audioContext.currentTime);
        return fastNode;
      }
      default:
        return effectNode;
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar /> {/* Navbar stays at the top */}

      <div className="flex flex-1 items-center justify-center mt-20">
        <div className="bg-gray-100 w-full sm:w-96 p-6 rounded-lg shadow-lg animate__animated animate__fadeIn animate__delay-1s">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 animate__animated animate__bounceIn">
            Voice Changer
          </h1>

          <input
            type="file"
            accept="audio/*"
            className="w-full mb-4 p-4 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 transform hover:scale-105"
            onChange={handleFileChange}
          />

          <div className="flex flex-col mb-6">
            <label className="text-lg font-semibold text-gray-700 mb-2">Choose an Effect</label>
            <select
              className="w-full p-4 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 transform hover:scale-105"
              value={effect}
              onChange={handleEffectChange}
            >
              <option value="normal">Normal</option>
              <option value="robot">Robot</option>
              <option value="slow">Slow</option>
              <option value="fast">Fast</option>
            </select>
          </div>

          <button
            onClick={handleApplyEffect}
            className="flex w-full p-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Apply Effect
          </button>

          {audioUrl && (
            <div className="mt-4 text-center animate__animated animate__fadeIn animate__delay-1s">
              <audio controls className="w-full mt-2">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Four AI. All rights reserved.
      </footer>
    </div>
  );
};

export default VoiceChanger;
