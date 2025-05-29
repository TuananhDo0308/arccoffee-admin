"use client";

import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Chip,
  Divider
} from "@nextui-org/react";

interface Voucher {
  id: string;
  code: string;
  description: string;
  percentage: number;
  maxDiscount: number;
  expiryDate: string; // Thay đổi từ year, month, day sang expiryDate
  minOrderValue: number;
  quantity: number;
  isActive?: boolean;
}

interface VoucherDetailModalProps {
  isOpen: boolean;
  voucher: Voucher;
  onClose: () => void;
}

const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({ isOpen, voucher, onClose }) => {
  // Hàm kiểm tra ngày hết hạn từ expiryDate
  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    return expiry < new Date();
  };

  const expired = isExpired(voucher.expiryDate);

  // Phân tích expiryDate để hiển thị ngày, tháng, năm
  const [year, month, day] = voucher.expiryDate.split('-').map(Number);
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <span>Voucher Details</span>
            <Chip
              color={expired ? "danger" : voucher.isActive ? "success" : "warning"}
              variant="flat"
              size="sm"
            >
              {expired ? "Expired" : voucher.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Voucher Code</p>
                <p className="font-bold text-lg font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {voucher.code}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity Available</p>
                <p className="font-medium text-lg">{voucher.quantity}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{voucher.description}</p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Discount Percentage</p>
                <p className="font-medium text-lg text-green-600">{voucher.percentage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maximum Discount</p>
                <p className="font-medium">{voucher.maxDiscount.toLocaleString()} VND</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Minimum Order Value</p>
              <p className="font-medium">{voucher.minOrderValue.toLocaleString()} VND</p>
            </div>

            <Divider />

            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium text-lg">
                {formattedDate}
              </p>
              {expired && (
                <p className="text-red-500 text-sm mt-1">This voucher has expired</p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Usage Conditions</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Minimum order value: {voucher.minOrderValue.toLocaleString()} VND</li>
                <li>• Maximum discount: {voucher.maxDiscount.toLocaleString()} VND</li>
                <li>• Discount rate: {voucher.percentage}% of order value</li>
                <li>• Available quantity: {voucher.quantity} uses</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VoucherDetailModal;