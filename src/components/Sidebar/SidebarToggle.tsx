import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="fixed left-0 top-1/2 z-[1000] -translate-y-1/2 rounded-r-md bg-primary p-2 text-white shadow-md"
    >
      <ChevronRight size={24} className={`transform transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
    </motion.button>
  );
};

export default SidebarToggle;

