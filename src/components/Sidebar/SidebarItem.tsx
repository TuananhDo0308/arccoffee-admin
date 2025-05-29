import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, Package, ShoppingCart, Boxes, FileInput, Settings, Gift, User, Map } from 'lucide-react';
import { useAppSelector } from "@/hooks/hook";

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
  vouchers: Gift,
  employee: User,
  branch: Map,
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  sidebarOpen,
}) => {
  // Retrieve user role from Redux store
  const userRole = useAppSelector((state) => state.auth?.role); // Adjust the path based on your Redux state structure

  // Define items to hide for Staff role
  const restrictedItems = ["Employee", "Branch"]; // Adjust these labels based on your item.label values
  const restrictedItemsAdmin = ["Settings"]; // Adjust these labels based on your item.label values

  // If user is Staff and the current item is restricted, don't render it
  if (userRole === "Staff" && restrictedItems.includes(item.label)) {
    return null;
  }
  if (userRole === "Admin" && restrictedItemsAdmin.includes(item.label)) {
    return null;
  }

  const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];

  return (
    <li>
      <Link href={item.route}>
        <motion.div
          className={`flex items-center rounded-lg ${
            sidebarOpen ? 'px-3 py-2' : 'px-2 py-2'
          } text-sm font-medium ${
            isActive
              ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconComponent
            className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'} ${
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