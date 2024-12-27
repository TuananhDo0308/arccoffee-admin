"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <motion.div
        initial={{ marginLeft: sidebarOpen ? "240px" : "80px" }}
        animate={{ marginLeft: sidebarOpen ? "240px" : "80px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 dark:bg-gray-800">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
