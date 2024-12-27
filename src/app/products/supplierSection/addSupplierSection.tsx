"use client";
import React, { useState } from "react";
import { addNewSupplier } from "@/API/productAPI";

const AddSupplierForm = ({
  addSupplier,
}: {
  addSupplier: any;
}) => {
  // Initialize the supplier with default values, including a null image
  const [newSupplier, setNewSupplier] = useState({
    str_tenncc: "",
    strsdt: "",
    str_dia_chi: "",
    strimg: null, // Set to null since we are not handling images for suppliers
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call API to add a new supplier
      const response = await addNewSupplier(newSupplier.str_tenncc,newSupplier.str_dia_chi,newSupplier.strsdt);
      console.log(response.newSupplier);
      addSupplier(response.newSupplier);
      setNewSupplier({
        str_tenncc: "",
        strsdt: "",
        str_dia_chi: "",
        strimg: null,
      });
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Failed to add supplier:", error);
      alert("Failed to add supplier. Please try again.");
    }
  };

  return (
    <>
      <div className="mb-8 flex w-full justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className=" right-15 top-30 flex h-10 w-10 items-center justify-center rounded-full border border-primary p-3 text-center text-3xl font-extrabold  text-primary hover:bg-primary hover:text-white"
        >
          +
        </button>
      </div>

      {showForm && (
        <div className="my-4 flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex w-full justify-between gap-10 rounded-sm border border-stroke bg-white px-13 py-10 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="flex-col">
              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Supplier Name:{" "}
              </label>
              <input
                type="text"
                value={newSupplier.str_tenncc}
                placeholder="Enter supplier name"
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, str_tenncc: e.target.value })
                }
                className=" rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />

              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Phone Number:{" "}
              </label>
              <input
                type="text"
                value={newSupplier.strsdt}
                placeholder="Enter phone number"
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, strsdt: e.target.value })
                }
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />

              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Address:{" "}
              </label>
              <input
                type="text"
                value={newSupplier.str_dia_chi}
                placeholder="Enter address"
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, str_dia_chi: e.target.value })
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />

              <div className="flex w-full justify-end">
                <button
                  type="submit"
                  className="mt-4 rounded bg-blue-500 p-2 text-white"
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddSupplierForm;
 