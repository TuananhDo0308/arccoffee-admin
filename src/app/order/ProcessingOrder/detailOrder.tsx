import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

import ProductList from "./productList";
import { getOrderDetail } from "@/API/orderAPI"; // Import your API function

interface Product {
  str_masp: string;
  str_tensp: string;
  d_don_gia: number;
  strimg: string;
}

interface OrderDetail {
  i_so_luong: number;
  Product: Product;
}

interface Order {
  str_mahd: string;
  str_ho_ten: string;
  d_tong: number;
  OrderDetails: OrderDetail[];
}

interface OrderDetailModalProps {
  orderId: Order | null; // Use orderId instead of passing the whole order
  onClose: () => void;
  onComplete: (orderId: string) => void; // New prop for completing the order
  isCompleted: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  onClose,
  onComplete,
  isCompleted,
}) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      // Fetch the order details when the modal opens
      fetchOrderDetail(orderId.str_mahd);
    }
  }, [orderId]);

  const fetchOrderDetail = async (id: string) => {
    try {
      const data = await getOrderDetail(id);
      setOrder(data.orderDetail); // Assuming your API response contains the order details under "orderDetail"
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(order.str_mahd, 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.str_mahd}`, 14, 32);
    doc.text(`Customer Name: ${orderId.str_ho_ten}`, 14, 40);
    doc.text(`Total Amount: $${order.d_tong}`, 14, 48);

    // Create the product table
    doc.autoTable({
      startY: 60, // Set starting Y position
      head: [["Product Name", "Quantity", "Price", "Total"]],
      body: order.OrderDetails.map((detail) => [
        detail.Product.str_tensp,
        detail.i_so_luong,
        `$${detail.Product.d_don_gia.toFixed(2)}`,
        `$${(detail.i_so_luong * detail.Product.d_don_gia).toFixed(2)}`,
      ]),
    });

    doc.save("order_details.pdf");
  };
  const submit = (mahd: string) => {
    onComplete(mahd);
    onClose();
  };

  if (!order || !orderId) return null;

  return (
    <div className="fixed inset-0 z-50 ml-[290px] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Order Details</h2>
        <p className="mb-4">
          <strong>Order ID:</strong> {order.str_mahd}
        </p>
        <p className="mb-4">
          <strong>Customer Name:</strong> {orderId.str_ho_ten}
        </p>
        <p className="mb-4">
          <strong>Total Amount:</strong> ${order.d_tong}
        </p>
        <h3 className="mb-2 text-xl font-semibold">Products:</h3>
        <ProductList orderDetails={order.OrderDetails} />
        <div className="mt-6 flex space-x-4">
          <button
            className="rounded-full bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-opacity-90"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
          {!isCompleted && (
            <button
              className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-opacity-90"
              onClick={() => submit(order.str_mahd)} // Call the onComplete function with the order ID
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
