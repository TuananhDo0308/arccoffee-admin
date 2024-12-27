"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      { icon: "chart", label: "Chart", route: "/" },
      { icon: "product", label: "Product", route: "/products" },
      { icon: "orders", label: "Orders", route: "/order" },
      { icon: "stock", label: "Stock", route: "/supplier" },
      { icon: "import", label: "Import History", route: "/importHistory" },
      { icon: "settings", label: "Settings", route: "/settings" },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? "240px" : "80px" }}
      animate={{ width: sidebarOpen ? "240px" : "80px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden bg-white shadow-lg dark:bg-gray-900"
    >
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/" className={`flex items-center ${sidebarOpen ? '' : 'justify-center w-full'}`}>
          <Image
            width={sidebarOpen ? 32 : 40}
            height={sidebarOpen ? 32 : 40}
            src="/images/logo/logo.png"
            alt="Logo"
            className={`transition-all duration-300 ${sidebarOpen ? 'mr-2' : 'mx-auto'}`}
          />
          {sidebarOpen && (
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Dashboard
            </span>
          )}
        </Link>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-4 z-[1000] rounded-full bg-white p-1.5 text-gray-500 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute -right-3 top-4 rounded-full bg-white p-1.5 text-gray-500 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <nav className="flex-grow overflow-y-auto px-4 py-4">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {sidebarOpen && (
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                {group.name}
              </h3>
            )}
            <ul className="space-y-2">
              {group.menuItems.map((menuItem, menuIndex) => (
                <SidebarItem
                  key={menuIndex}
                  item={menuItem}
                  isActive={activeItem === menuItem.route}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

