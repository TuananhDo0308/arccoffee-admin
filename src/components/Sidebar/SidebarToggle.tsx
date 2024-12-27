import React from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={`fixed ${
        sidebarOpen ? 'left-[185px]' : 'left-[50px]'
      } top-4 z-[1000] rounded-full bg-white p-1.5 text-gray-500 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-300`}
    >
      {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};

export default SidebarToggle;

