"use client";
import React, { useState, useEffect } from "react";
import { getCompletedOrders } from "@/API/orderAPI"; // Update to use getCompletedOrders
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import OrderDetailModal from "../ProcessingOrder/detailOrder"; // Import the OrderDetailModal component

interface Order {
  str_mahd: string;
  str_ho_ten: string;
  ldt_ngay_dat: string;
  d_tong: number;
}

const CompletedOrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showActions, setShowActions] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const orderData = await getCompletedOrders();
        setOrders(orderData.orders);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    }
    fetchOrders();
  }, []);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowActions(null);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Completed Orders
        </h4>
      </div>

      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Order ID</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Customer Name</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Order Date</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Total Amount</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Status</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {orders.map((order, index) => (
        <div
          className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.str_mahd}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.str_ho_ten}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {new Date(order.ldt_ngay_dat).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">${order.d_tong}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">Completed</p> {/* Status column */}
          </div>
          <div className="relative col-span-1 flex items-center">
            <IconButton
              aria-label="actions"
              onClick={() =>
                setShowActions(showActions === index ? null : index)
              }
            >
              <MoreVertIcon />
            </IconButton>

            {showActions === index && (
              <div className="absolute right-0 top-10 z-10 rounded border bg-white p-2 shadow-md">
                <IconButton
                  aria-label="details"
                  onClick={() => handleOpenDetail(order)}
                >
                  <InfoIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      ))}

      {selectedOrder && (
        <OrderDetailModal 
          orderId={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          isCompleted={true}
        />
      )}
    </div>
  );
};

export default CompletedOrderTable;
