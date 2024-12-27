import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, Package, ShoppingCart, Boxes, FileInput, Settings } from 'lucide-react';

interface SidebarItemProps {
  item: {
    icon: string;
    label: string;
    route: string;
  };
  isActive: boolean;
  sidebarOpen: boolean;
}

const iconComponents = {
  chart: BarChart2,
  product: Package,
  orders: ShoppingCart,
  stock: Boxes,
  import: FileInput,
  settings: Settings,
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  sidebarOpen,
}) => {
  const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];

  return (
    <li>
      <Link href={item.route}>
        <motion.div
          className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
            isActive
              ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconComponent
            className={`mr-3 h-5 w-5 ${
              isActive ? "text-blue-600 dark:text-white" : "text-gray-500 dark:text-gray-400"
            }`}
          />
          {sidebarOpen && <span>{item.label}</span>}
        </motion.div>
      </Link>
    </li>
  );
};

export default SidebarItem;

