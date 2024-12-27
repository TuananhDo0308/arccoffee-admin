"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import logo from "@/assets/logo.png";
import { useAppDispatch } from "@/hooks/hook";
import { removeToken } from "@/slices/authSlice";
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
      { icon: "settings", label: "Settings", route: "/settings" },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? "200px" : "64px" }}
      animate={{ width: sidebarOpen ? "200px" : "64px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden bg-white shadow-lg dark:bg-gray-900"
    >
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/" className={`flex items-center ${sidebarOpen ? '' : 'justify-center w-full'}`}>
          <Image
            width={sidebarOpen ? 25 : 25}
            height={sidebarOpen ? 25 : 25}
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}
          />
          {sidebarOpen && (
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Arc
            </span>
          )}
        </Link>
      </div>


      <nav className={`flex-grow overflow-y-auto ${sidebarOpen ? 'px-4' : 'px-2'} py-4`}>
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
      <div className={`mt-auto p-4 ${sidebarOpen ? '' : 'flex justify-center'}`}>
        <button
          onClick={() => {dispatch(removeToken())}}
          className="flex items-center text-red-500 hover:text-red-600"
        >
          <LogOut size={20} className={`${sidebarOpen ? 'mr-2' : ''}`} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

