import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import Features from './Features';
import Pricing from './Pricing';
import VoiceGenerator from './VoiceGenerator';
import Team from './Team';
import ImageGenerator from './ImageGenerator';
import TexttoSpeech from "./TexttoSpeech";
import VoiceChanger from "./VoiceChanger";
import Profile from './Profile';
import Startpage from './Startpage';

import './App.css';
import LogoutPage from './Logout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/voicegenerator" element={<VoiceGenerator />} />
          <Route path="/team" element={<Team />} />
          <Route path="/imagegenerator" element={<ImageGenerator />} />
          <Route path="/texttospeech" element={<TexttoSpeech />} />
          <Route path="/voicechanger" element={<VoiceChanger />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile" element={<Profile />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;