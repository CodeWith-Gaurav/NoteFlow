import React from "react";
import { motion } from "framer-motion";

const Dashboard = ({ setCurrentPage }) => {
  const cards = [
    { title: "Biology Notes", color: "from-blue-500 to-cyan-400" },
    { title: "Math Formulae", color: "from-purple-500 to-pink-400" },
    { title: "History Timeline", color: "from-orange-500 to-yellow-400" },
    { title: "Physics Concepts", color: "from-green-500 to-teal-400" },
    { title: "Chemistry Reactions", color: "from-red-500 to-rose-400" },
    { title: "Computer Science", color: "from-indigo-500 to-sky-400" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Infographics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            onClick={() => setCurrentPage("infographic")}
            className={`bg-gradient-to-r ${card.color} text-white rounded-2xl shadow-lg p-6 cursor-pointer`}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-sm mt-2">Click to view infographic →</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
