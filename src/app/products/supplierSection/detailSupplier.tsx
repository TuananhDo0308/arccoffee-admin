import React, { useState } from "react";
import { updateSupplier } from "@/API/productAPI";

export default function DetailSupplier({
  supplier,
  onClose,
  onSave,
}: {
  supplier: any;
  onClose: any;
  onSave: any;
}) {
  const [supplierName, setSupplierName] = useState(supplier.str_tenncc || "");
  const [phoneNumber, setPhoneNumber] = useState(supplier.strsdt || "");
  const [address, setAddress] = useState(supplier.str_dia_chi || "");

  const handleSave = async () => {
    try {
      const updatedSupplier = {
        ...supplier,
        str_tenncc: supplierName,
        strsdt: phoneNumber,
        str_dia_chi: address,
      };
      console.log("Supplier Name:", supplierName);
    console.log("Phone Number:", updatedSupplier.phoneNumber);
    console.log("Address:", address);
      const response = await updateSupplier(supplier.str_mancc, supplierName, address, phoneNumber);
      console.log("Flaggg:" , response);
      onSave(updatedSupplier);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Failed to update supplier:", error);
      alert("Failed to update supplier. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-99999 ml-[290px] flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-3xl font-bold text-blue-800">Edit Supplier</h2>

        <div>
          <div className="flex justify-between">
            {/* Supplier Name Input */}
            <div className="w-full">
              <label className="text-gray-700 mt-4 block text-lg font-bold">
                Supplier Name
              </label>
              <input
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="text-gray-700 mt-4 block text-lg font-bold">
                Phone Number
              </label>
              <input
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="text-gray-700 mt-2 block text-lg font-bold">
              Address
            </label>
            <input
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-meta-1 px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
