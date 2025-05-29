"use client";

import React, { useState } from "react";
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
  SelectItem
} from "@nextui-org/react";
import { useAppSelector } from "@/hooks/hook";
import { apiLinks, httpClient } from "@/utils";

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface VoucherForm {
  code: string;
  description: string;
  percentage: number;
  maxDiscount: number;
  year: number;
  month: number;
  day: number;
  minOrderValue: number;
  quantity: number;
}

const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<VoucherForm>({
    code: "",
    description: "",
    percentage: 0,
    maxDiscount: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    minOrderValue: 0,
    quantity: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<VoucherForm>>({});
  const token = useAppSelector(state => state.auth.token.accessToken);

  const validateForm = () => {
    const newErrors: Partial<VoucherForm> = {};

    if (!formData.code.trim()) newErrors.code = "Voucher code is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.percentage <= 0 || formData.percentage > 100) newErrors.percentage = "Percentage must be between 1-100";
    if (formData.maxDiscount <= 0) newErrors.maxDiscount = "Max discount must be greater than 0";
    if (formData.minOrderValue < 0) newErrors.minOrderValue = "Min order value cannot be negative";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await httpClient.post({
        url: apiLinks.voucher.index,
        data: formData,
        token: token,
      });
      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error creating voucher:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      percentage: 0,
      maxDiscount: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      minOrderValue: 0,
      quantity: 0
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Create New Voucher</ModalHeader>
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

            <div className="md:col-span-2">
              <p className="text-sm font-medium mb-2">Expiry Date</p>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  label="Year"
                  selectedKeys={[formData.year.toString()]}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                >
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year.toString()}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Month"
                  selectedKeys={[formData.month.toString()]}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                >
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Day"
                  selectedKeys={[formData.day.toString()]}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                >
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Create Voucher
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateVoucherModal;
