"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Skeleton } from "@nextui-org/react";
import { useAppSelector } from "@/hooks/hook";
import { httpClient, clientLinks, apiLinks } from "@/utils";
import { MoreVertical, CheckCircle, Info } from 'lucide-react';
import OrderDetailModal from "./detailOrder";
import ProductsSkeleton from "../skeleton";

interface PendingBill {
  id: string;
  items: any[];
  customerId: string;
  shippingMethodId: string;
  status: string;
  customerName: string;
  orderDate: string;
  paymentId: string;
  voucherId: string | null;
  totalPrice: number;
}

const ProcessingOrderTable = () => {
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PendingBill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const token = useAppSelector(state => state.auth.token.accessToken);

  useEffect(() => {
    fetchPendingBills();
  }, [token]);

  const fetchPendingBills = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get({
        url: apiLinks.bill.getPendingBills,
        token: token,
      });
      setPendingBills(response.data.data);
    } catch (error) {
      console.error("Error fetching pending bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await httpClient.put({
        url: apiLinks.bill.updateStatusBills(orderId),
        token: token,
      });
      fetchPendingBills();
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const handleViewDetails = async (order: PendingBill) => {
    setIsLoadingProducts(true);
    setSelectedOrder(order);
    // Simulate loading products (replace with actual API call if needed)
    setTimeout(() => {
      setIsLoadingProducts(false);
    }, 1000);
  };

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "orderDate", label: "Order Date" },
    { key: "totalPrice", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (item: PendingBill, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <p className="text-bold">{item.id}</p>;
      case "customerName":
        return <p>{item.customerName}</p>;
      case "orderDate":
        return <p>{new Date(item.orderDate).toLocaleDateString()}</p>;
      case "totalPrice":
        return <p>{item.totalPrice.toLocaleString()} VND</p>;
      case "status":
        return <p>Processing</p>;
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Order actions">
              <DropdownItem onPress={() => handleCompleteOrder(item.id)} startContent={<CheckCircle size={20} />}>
                Complete Order
              </DropdownItem>
              <DropdownItem onPress={() => handleViewDetails(item)} startContent={<Info size={20} />}>
                View Details
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p>N/A</p>;
    }
  };

  return (
    <>
      <Table aria-label="Processing Orders Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={pendingBills}
          emptyContent={isLoading ? " " : "No pending orders found"}
          loadingContent={<LoadingSkeleton />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onComplete={handleCompleteOrder}
        >
          {isLoadingProducts ? <ProductsSkeleton /> : null}
        </OrderDetailModal>
      )}
    </>
  );
};

const LoadingSkeleton = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(6)].map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <Skeleton className="w-full">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default ProcessingOrderTable;
