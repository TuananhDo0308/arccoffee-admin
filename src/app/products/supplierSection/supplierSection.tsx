"use client";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Material-UI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { removeSupplier } from "@/API/productAPI";
import DetailSupplier from "./detailSupplier";

const SupplierTable = ({
  suppliers,
  setSuppliers,
}: {
  suppliers: any[];
  setSuppliers: any;
}) => {
  const [showActions, setShowActions] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);

  const handleOpenDetail = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowActions(null);
  };

  const handleDelete = async (index: number, supplierId: string) => {
    try {
      await removeSupplier(supplierId);
      const updatedSuppliers = suppliers.filter(
        (supplier) => supplier.str_mancc !== supplierId,
      );
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("An error occurred while deleting the supplier.");
    }
  };

  const handleSaveDetail = (updatedSupplier: any) => {
    const updatedSuppliers = suppliers.map((sup) =>
      sup.str_mancc === updatedSupplier.str_mancc ? updatedSupplier : sup,
    );
    setSuppliers(updatedSuppliers);
    setSelectedSupplier(null); // Close the modal after saving
  };

  // Filtered suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.str_tenncc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Supplier List
        </h4>
      </div>

      <div className="mb-4 flex justify-between px-4">
        <input
          type="text"
          placeholder="Search by supplier name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mx-3 w-[500px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Supplier Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Phone Number</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Address</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {filteredSuppliers.map((supplier, index) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {supplier.str_tenncc}
            </p>
          </div>

          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {supplier.strsdt}
            </p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {supplier.str_dia_chi}
            </p>
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
                  aria-label="edit"
                  className="text-white"
                  onClick={() => handleOpenDetail(supplier)} // Trigger modal on click
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(index, supplier.str_mancc)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
            {selectedSupplier && (
              <DetailSupplier
                supplier={selectedSupplier}
                onSave={handleSaveDetail} // Pass the save handler
                onClose={() => setSelectedSupplier(null)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplierTable;
