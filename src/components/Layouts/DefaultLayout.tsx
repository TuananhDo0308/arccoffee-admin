"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/hook";
import SignIn from "@/app/auth/signin/page";
import SidebarToggle from "../Sidebar/SidebarToggle";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useAppSelector(state => state.auth.token)
  if (!user)
    return <SignIn></SignIn>
  else
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ marginLeft: sidebarOpen ? "240px" : "80px" }}
        animate={{ marginLeft: sidebarOpen ? "240px" : "80px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <main className="flex-1 z-0 py-8 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 dark:bg-gray-800">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <SidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {children}
        </main>
      </motion.div>
    </div>
  );
}
