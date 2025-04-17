import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


const Features = () => {
  const features = [
    { title: "AI Voice Generation", text: "Generate high-quality, natural-sounding voices using advanced AI technology." },
    { title: "Customizable Voices", text: "Adjust voice styles, tones, and emotions to suit your needs." },
    { title: "Easy Integration", text: "Seamlessly integrate our API into your applications with comprehensive documentation." },
    { title: "Multi-Language Support", text: "Generate voices in multiple languages for global applications." },
    { title: "Real-Time Processing", text: "Experience fast and real-time voice generation for dynamic applications." },
    { title: "Scalable Solutions", text: "Our platform scales with your needs, from small projects to enterprise-level applications." }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Features Section with Fade-in Effect */}
      <motion.section
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="container mx-auto py-12 px-6"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Features
        </motion.h1>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform text-center"
            >
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
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

export default Features;
