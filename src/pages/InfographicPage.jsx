import React from "react";
import { motion } from "framer-motion";

const InfographicPage = ({ setCurrentPage }) => {
  const points = [
    "Key Concept 1: Simplified explanation",
    "Key Concept 2: Visual representation",
    "Key Concept 3: Easy to remember summary"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentPage("dashboard")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-bold mb-4">Infographic Title</h2>

        {/* Mock Chart */}
        <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg mb-6"></div>

        {/* Key Points */}
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {points.map((point, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              {point}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default InfographicPage;
