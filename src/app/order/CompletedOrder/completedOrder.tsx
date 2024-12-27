"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Skeleton } from "@nextui-org/react";
import { useAppSelector } from "@/hooks/hook";
import { httpClient, clientLinks } from "@/utils";
import { MoreVertical, Info } from 'lucide-react';
import OrderDetailModal from "../ProcessingOrder/detailOrder";

interface CompletedBill {
  id: string;
  items: any[];
  customerName: string;
  customerId: string;
  shippingMethodId: string;
  status: string;
  orderDate: string;
  paymentId: string;
  voucherId: string | null;
  totalPrice: number;
}

const CompletedOrderTable = () => {
  const [completedBills, setCompletedBills] = useState<CompletedBill[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CompletedBill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAppSelector(state => state.auth.token.accessToken);

  useEffect(() => {
    fetchCompletedBills();
  }, [token]);

  const fetchCompletedBills = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get({
        url: clientLinks.bill.getCompletedBills,
        token: token,
      });
      setCompletedBills(response.data);
    } catch (error) {
      console.error("Error fetching completed bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "orderDate", label: "Order Date" },
    { key: "totalPrice", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (item: CompletedBill, columnKey: React.Key) => {
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
        return <p>Completed</p>;
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Order actions">
              <DropdownItem onPress={() => setSelectedOrder(item)} startContent={<Info size={20} />}>
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
      <Table aria-label="Completed Orders Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={completedBills}
          emptyContent={isLoading ? " " : "No completed orders found"}
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
          onComplete={() => {}} // This is a no-op for completed orders
        />
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

export default CompletedOrderTable;

