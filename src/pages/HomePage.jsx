import React from "react";
import { motion } from "framer-motion";
import UploadBox from "../components/UploadBox";
import TiltImage from "../components/TiltImage";

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered <br />
                <span className="text-blue-600">Infographic Generator</span> <br />
                for Smarter Learning
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Transform your notes and documents into beautiful, engaging infographics.
              </p>
              <UploadBox />
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <TiltImage />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
