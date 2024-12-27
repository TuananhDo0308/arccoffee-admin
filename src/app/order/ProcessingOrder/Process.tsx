import React, { useState, useEffect } from "react";
import { getProcessingOrder, completeOrder, getCompletedOrders } from "@/API/orderAPI";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import OrderDetailModal from "./detailOrder";
import { httpClient, clientLinks } from "@/utils"; 
import { Token } from "aws-sdk";
import { useAppSelector } from "@/hooks/hook";

interface Order {
  str_mahd: string;
  str_ho_ten: string;
  ldt_ngay_dat: string;
  d_tong: number;
}

interface PendingBill {
  id: string;
  items: any[]; 
  customerId: string;
  shippingMethodId: string;
  status: string; 
  orderDate: string; 
  paymentId: string;
  voucherId: string | null; 
  totalPrice: number;
}

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showActions, setShowActions] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pendingBill, setPendingBill] = useState<PendingBill[]>([]);

  const token = useAppSelector(state => state.auth.token.accessToken)
  useEffect(() => {
    const fetchPendingBils = async () => {
      const response = await httpClient.get({
        url: clientLinks.bill.getPendingBills,
        token: token,
      })

      const data = response.data;
      setPendingBill(data);
    }

    fetchPendingBils();
  }, [token])

  // useEffect(() => {
  //   async function fetchOrders() {
  //     try {
  //       const orderData = await getProcessingOrder();
  //       setOrders(orderData.orders);
  //     } catch (error) {
  //       console.error("Error fetching orders:", error);
  //     }
  //   }
  //   fetchOrders();
  // }, []);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowActions(null);
  };

  const markOrderComplete = async (orderId: string) => {
    try {
      await completeOrder(orderId);
      const updatedOrders = orders.filter((order) => order.str_mahd !== orderId);
      setOrders(updatedOrders);
      console.log(`Order ${orderId} marked as completed.`);
      setShowActions(null);
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Failed to complete the order. Please try again.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Processing Order
        </h4>
      </div>

      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Order ID</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Customer ID</p>
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

      {pendingBill.map((order, index) => (
        <div
          className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.id}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.customerId}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">${order.totalPrice}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">Processing</p> {/* Default Process */}
          </div>
          <div className="relative col-span-1 flex items-center">
            <IconButton
              aria-label="actions"
              onClick={() => setShowActions(showActions === index ? null : index)}
            >
              <MoreVertIcon />
            </IconButton>

            {showActions === index && (
              <div className="absolute right-0 top-10 z-10 rounded border bg-white p-2 shadow-md">
                <IconButton
                  aria-label="complete"
                  className="text-white"
                  onClick={() => markOrderComplete(order.str_mahd)}
                >
                  <CheckCircleIcon />
                </IconButton>
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

      {/* {selectedOrder && (
        <OrderDetailModal 
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onComplete={markOrderComplete} // Pass the complete order function to the modal
          isCompleted={false}
        />
      )} */}
    </div>
  );
};

export default OrderTable;
