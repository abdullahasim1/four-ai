/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";


const pricingPlans = [
  {
    name: "Basic",
    price: "$10/month",
    features: ["5000 characters per month", "Standard AI voices"],
  },
  {
    name: "Pro",
    price: "$30/month",
    features: ["50,000 characters per month", "Premium AI voices", "Custom voice settings"],
  },
  {
    name: "Enterprise",
    price: "$100/month",
    features: ["Unlimited characters", "All AI voice features", "Dedicated support"],
  },
];

const Pricing = () => {
  return (
    <>
      <Navbar />

      {/* Pricing Section with Fade-in Effect */}
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pricing Plans</h2>

          {/* Pricing Cards Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.price}</p>
                <ul className="text-gray-500 mt-4 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Choose Plan
                </motion.button>
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

export default Pricing;
