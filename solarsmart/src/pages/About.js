import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.div
      className="max-w-3xl mx-auto mt-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-green-700 mb-4">About SolarSmart</h2>
      <p className="text-gray-700 leading-relaxed">
        SolarSmart is a student project that promotes awareness about renewable
        energy. We believe that education and technology can help everyone
        transition to a cleaner and more sustainable future.
      </p>
    </motion.div>
  );
}
