"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Skeleton,
  Chip
} from "@nextui-org/react";
import { useAppSelector } from "@/hooks/hook";
import { httpClient, clientLinks, apiLinks } from "@/utils";
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import EditVoucherModal from "./EditVoucherModal";
import VoucherDetailModal from "./VoucherDetailModal";

interface Voucher {
  id: string;
  code: string;
  description: string;
  percentage: number;
  maxDiscount: number;
  expiryDate:string
  minOrderValue: number;
  quantity: number;
  isActive?: boolean;
}

interface VoucherTableProps {
  refreshTrigger: number;
  onRefresh: () => void;
}

const VoucherTable: React.FC<VoucherTableProps> = ({ refreshTrigger, onRefresh }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAppSelector(state => state.auth.token.accessToken);

  useEffect(() => {
    fetchVouchers();
  }, [token, refreshTrigger]);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await httpClient.get({
        url: apiLinks.voucher.index, // Update this with your actual endpoint
        token: token,
      });
      setVouchers(response.data.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // Mock data for demonstration
      setVouchers([
        {
          id: "1",
          code: "SUMMER2024",
          description: "Summer discount voucher",
          percentage: 20,
          maxDiscount: 100000,
          year: 2024,
          month: 12,
          day: 31,
          minOrderValue: 500000,
          quantity: 100,
          isActive: true
        },
        {
          id: "2",
          code: "WELCOME10",
          description: "Welcome new customer",
          percentage: 10,
          maxDiscount: 50000,
          year: 2024,
          month: 6,
          day: 30,
          minOrderValue: 200000,
          quantity: 50,
          isActive: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    try {
      await httpClient.delete({
        url: `/api/vouchers/${voucherId}`, // Update with your actual endpoint
        token: token,
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDetailModalOpen(true);
  };

  const isExpired = (year: number, month: number, day: number) => {
    const expiryDate = new Date(year, month - 1, day);
    return expiryDate < new Date();
  };

  const columns = [
    { key: "code", label: "Voucher Code" },
    { key: "description", label: "Description" },
    { key: "percentage", label: "Discount %" },
    { key: "maxDiscount", label: "Max Discount" },
    { key: "expiry", label: "Expiry Date" },
    { key: "quantity", label: "Quantity" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (item: Voucher, columnKey: React.Key) => {
    switch (columnKey) {
      case "code":
        return <p className="text-bold font-mono">{item.code}</p>;
      case "description":
        return <p className="max-w-xs truncate">{item.description}</p>;
      case "percentage":
        return <p>{item.percentage}%</p>;
      case "maxDiscount":
        return <p>{item.maxDiscount.toLocaleString()} VND</p>;
      case "expiry":
        return <p>{item.expiryDate}</p>;
      case "quantity":
        return <p>{item.quantity}</p>;
     case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <MoreVertical size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Voucher actions">
              <DropdownItem key={"2"} onPress={() => handleViewDetails(item)} startContent={<Eye size={20} />}>
                View Details
              </DropdownItem>
              <DropdownItem key={"1"} onPress={() => handleEditVoucher(item)} startContent={<Edit size={20} />}>
                Edit Voucher
              </DropdownItem>
              <DropdownItem 
              key={""}
                onPress={() => handleDeleteVoucher(item.id)} 
                startContent={<Trash2 size={20} />}
                className="text-danger"
                color="danger"
              >
                Delete Voucher
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
      <Table aria-label="Vouchers Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={vouchers}
          emptyContent={isLoading ? " " : "No vouchers found"}
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

      {selectedVoucher && (
        <>
          <EditVoucherModal
            isOpen={isEditModalOpen}
            voucher={selectedVoucher}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedVoucher(null);
            }}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedVoucher(null);
              onRefresh();
            }}
          />
          
          <VoucherDetailModal
            isOpen={isDetailModalOpen}
            voucher={selectedVoucher}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedVoucher(null);
            }}
          />
        </>
      )}
    </>
  );
};

const LoadingSkeleton = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(8)].map((_, cellIndex) => (
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

export default VoucherTable;
