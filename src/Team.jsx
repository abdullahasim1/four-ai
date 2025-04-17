/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";


import saifImage from "./assets/images/saif.jpg";
import abdullahImage from "./assets/images/abdullah.jpg";
import adeelImage from "./assets/images/adeel.jpg";
import malikImage from "./assets/images/malik.jpg";


const teamMembers = [
  {
    name: "Saif Ur Rahman",
    role: "Lead Developer",
    img: saifImage, // Using imported image
  },
  {
    name: "Abdullah Bin Asim",
    role: "Frontend Developer",
    img: abdullahImage, // Using imported image
  },
  {
    name: "M Adeel Gujar",
    role: "Backend Developer",
    img: adeelImage, // Using imported image
  },
  {
    name: "Malik Mujahid Azam Lail",
    role: "UI/UX Designer",
    img: malikImage, // Using imported image
  },
];

const Team = () => {
  return (
    <>
      <Navbar />

      {/* Team Section with Fade-in Effect */}
      <motion.section
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="bg-gray-100 py-12 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="text-gray-600 mt-2">Passionate professionals dedicated to innovation.</p>

          {/* Team Cards Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
              >
                <motion.img
                  src={member.img}
                  alt={member.name}
                  className="w-23 h-24 rounded-full object-cover"
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
    </>
  );
};

export default Team;