import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`min-h-screen pt-24 pb-16 ${className}`}
    >
      {children}
    </motion.main>
  );
};
