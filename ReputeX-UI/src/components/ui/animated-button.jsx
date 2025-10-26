// src/components/ui/animated-button.jsx
import React from "react";
import { motion } from "framer-motion";

export const AnimatedButton = ({ children, className = "", ...props }) => {
  return (
    <motion.button
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-green-500 bg-transparent px-8 py-3 font-bold text-green-400 transition-all duration-300 hover:border-green-400 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-green-500 to-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
        {children}
      </span>
    </motion.button>
  );
};
