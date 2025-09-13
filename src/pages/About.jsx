import React from "react";
import { motion } from "framer-motion";

const team = [
  { name: "Harsh Verma", role: "Backend Developer" },
  { name: "Gaurav Vashistha", role: "Frontend + AI Integration" },
  { name: "Gunjan Jangid", role: "Frontend Developer" },
  { name: "Chirag Murdiya", role: "Backend Developer" }
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">About NoteFlow</h2>
      <p className="text-gray-700 mb-10">
        NoteFlow is an AI-powered platform designed to transform raw notes into engaging infographics,
        making study sessions smarter and more effective.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-4"></div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
