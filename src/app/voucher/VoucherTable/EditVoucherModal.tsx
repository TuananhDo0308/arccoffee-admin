"use client";

import React, { useState, useEffect } from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch
} from "@nextui-org/react";
import { useAppSelector } from "@/hooks/hook";
import { apiLinks, httpClient } from "@/utils";

interface Voucher {
  id: string;
  code: string;
  description: string;
  percentage: number;
  maxDiscount: number;
  expiryDate: string; // Dữ liệu nhận vào từ voucher
  minOrderValue: number;
  quantity: number;
  isActive?: boolean;
}

// Interface cho dữ liệu gửi lên API (không có expiryDate, thay bằng year, month, day)
interface VoucherSubmit {
  id: string;
  code: string;
  description: string;
  percentage: number;
  maxDiscount: number;
  year: number;
  month: number;
  day: number;
  minOrderValue: number;
  quantity: number;
  isActive?: boolean;
}

interface EditVoucherModalProps {
  isOpen: boolean;
  voucher: Voucher;
  onClose: () => void;
  onSuccess: () => void;
}

const EditVoucherModal: React.FC<EditVoucherModalProps> = ({ isOpen, voucher, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Voucher>(voucher);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Voucher>>({});
  const token = useAppSelector(state => state.auth.token.accessToken);

  useEffect(() => {
    // Khi voucher thay đổi, phân tích expiryDate thành các giá trị riêng lẻ để điền vào Select
    setFormData(voucher);
  }, [voucher]);

  const validateForm = () => {
    const newErrors: Partial<Voucher> = {};

    if (!formData.code.trim()) newErrors.code = "Voucher code is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.percentage <= 0 || formData.percentage > 100) newErrors.percentage = "Percentage must be between 1-100";
    if (formData.maxDiscount <= 0) newErrors.maxDiscount = "Max discount must be greater than 0";
    if (formData.minOrderValue < 0) newErrors.minOrderValue = "Min order value cannot be negative";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";

    // Validate expiryDate
    if (!formData.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in YYYY-MM-DD format";
    } else {
      const [year, month, day] = formData.expiryDate.split('-').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        newErrors.expiryDate = "Expiry date must be a valid future date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Tách expiryDate thành year, month, day
      const [year, month, day] = formData.expiryDate.split('-').map(Number);

      // Tạo dữ liệu gửi đi (không bao gồm expiryDate, thay bằng year, month, day)
      const submitData: VoucherSubmit = {
        id: formData.id,
        code: formData.code,
        description: formData.description,
        percentage: formData.percentage,
        maxDiscount: formData.maxDiscount,
        year,
        month,
        day,
        minOrderValue: formData.minOrderValue,
        quantity: formData.quantity,
        isActive: formData.isActive,
      };

      await httpClient.put({
        url: `${apiLinks.voucher.index}/${formData.id}`,
        data: submitData, // Gửi dữ liệu với year, month, day
        token: token,
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating voucher:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Phân tích expiryDate để điền vào Select khi mở modal
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  useEffect(() => {
    if (voucher.expiryDate) {
      const [year, month, day] = voucher.expiryDate.split('-');
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);
      setFormData(prev => ({ ...prev, expiryDate: voucher.expiryDate }));
    }
  }, [voucher]);

  // Cập nhật expiryDate khi thay đổi Select
  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const expiryDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      if (expiryDate !== formData.expiryDate) {
        setFormData(prev => ({ ...prev, expiryDate }));
      }
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Voucher</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Voucher Code"
              placeholder="Enter voucher code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              isInvalid={!!errors.code}
              errorMessage={errors.code}
              isRequired
            />
            
            <Input
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity.toString()}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              isInvalid={!!errors.quantity}
              errorMessage={errors.quantity}
              isRequired
            />

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Enter voucher description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
                isRequired
              />
            </div>

            <Input
              label="Discount Percentage"
              type="number"
              placeholder="Enter percentage (1-100)"
              value={formData.percentage.toString()}
              onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
              isInvalid={!!errors.percentage}
              errorMessage={errors.percentage}
              endContent={<span className="text-default-400">%</span>}
              isRequired
            />

            <Input
              label="Max Discount Amount"
              type="number"
              placeholder="Enter max discount"
              value={formData.maxDiscount.toString()}
              onChange={(e) => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) || 0 })}
              isInvalid={!!errors.maxDiscount}
              errorMessage={errors.maxDiscount}
              endContent={<span className="text-default-400">VND</span>}
              isRequired
            />

            <Input
              label="Min Order Value"
              type="number"
              placeholder="Enter minimum order value"
              value={formData.minOrderValue.toString()}
              onChange={(e) => setFormData({ ...formData, minOrderValue: parseInt(e.target.value) || 0 })}
              isInvalid={!!errors.minOrderValue}
              errorMessage={errors.minOrderValue}
              endContent={<span className="text-default-400">VND</span>}
            />

            <div className="flex items-center gap-2">
              <Switch
                isSelected={formData.isActive}
                onValueChange={(value) => setFormData({ ...formData, isActive: value })}
              >
                Active Status
              </Switch>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-2">Expiry Date</p>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  label="Year"
                  selectedKeys={[selectedYear]}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year.toString()}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Month"
                  selectedKeys={[selectedMonth]}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Day"
                  selectedKeys={[selectedDay]}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              {errors.expiryDate && <p className="text-danger text-sm mt-1">{errors.expiryDate}</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Update Voucher
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditVoucherModal;