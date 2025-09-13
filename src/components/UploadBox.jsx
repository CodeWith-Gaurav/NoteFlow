import React from "react";
import { motion } from "framer-motion";

const UploadBox = () => {
  return (
    <motion.div
      className="relative border-2 border-dashed border-blue-400 rounded-2xl p-8 bg-blue-50/40 cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      <p className="text-lg text-gray-700">
        Drag & drop your notes or <span className="text-blue-600 font-semibold">Click to Upload</span>
      </p>
    </motion.div>
  );
};

export default UploadBox;
