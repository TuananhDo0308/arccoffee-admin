"use client";
import React, { useState } from "react";
import { addNewProduct } from "@/API/productAPI";
import { IMG_URL } from "@/API/LinkAPI";
import defaultIMG from "@/assets/cog.png"; // Import your default image
import Image from "next/image";

const AddItemForm = ({
  addItem,
  categories,
  suppliers,
}: {
  addItem: any;
  categories: any[];
  suppliers: any[];
}) => {
  // Initialize the product with default values, including the default image URL
  const [newProduct, setNewProduct] = useState({
    str_tensp: "",
    d_don_gia: 0,
    i_so_luong: 0,
    strimg: null as File | null, // Set as File type
    str_malh: "",
    str_mancc: "",
    txt_mo_ta: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultIMG.src,
  ); // Use default image URL as initial preview
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", newProduct.str_tensp);
    formData.append("price", newProduct.d_don_gia.toString());
    formData.append("quantity", "0");
    formData.append("categoryId", newProduct.str_malh); // Send category ID instead of name
    formData.append("supplierId", newProduct.str_mancc);
    formData.append("description", newProduct.txt_mo_ta);

    // If a file was selected, append it, otherwise don't append any file data
    if (newProduct.strimg) {
      formData.append("profilePicture", newProduct.strimg); // Append image file if selected
    }

    try {
      const response = await addNewProduct(formData);
      console.log(response.newProduct);
      addItem(response.newProduct);
      setNewProduct({
        str_tensp: "",
        d_don_gia: 0,
        i_so_luong: 0,
        strimg: null,
        str_malh: "",
        str_mancc: "",
        txt_mo_ta: "",
      });
      setImagePreview(defaultIMG.src); // Reset to default image
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, strimg: file }); // Store the File object

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Preview the image
      };
      reader.readAsDataURL(file);
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
            <div className="h-full flex-col justify-between ">
              <label className="mb-1 mt-3 block text-sm font-medium text-black dark:text-white">
                Image:{" "}
              </label>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="mb-4 mt-4"
                  width={150}
                  height={150}
                />
              )}

              <input
                type="file"
                onChange={handleImageChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
              <label className="mb-1 mt-3 block text-sm font-medium text-black dark:text-white">
                Product Name:{" "}
              </label>
              <input
                type="text"
                value={newProduct.str_tensp}
                placeholder="Enter product name"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, str_tensp: e.target.value })
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              />
            </div>

            <div className="flex-col">
              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Price:{" "}
              </label>
              <input
                type="number"
                value={newProduct.d_don_gia}
                placeholder="Enter price"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, d_don_gia: +e.target.value })
                }
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
          

              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Category:{" "}
              </label>
              <select
                value={newProduct.str_malh}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, str_malh: e.target.value })
                }
                className=" rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.str_malh} value={category.str_malh}>
                    {category.str_tenlh}
                  </option>
                ))}
              </select>
              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Supplier:{" "}
              </label>
              <select
                value={newProduct.str_mancc}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, str_mancc: e.target.value })
                }
                className=" rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.str_tenncc} value={supplier.str_mancc}>
                    {supplier.str_tenncc}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-col ">
              <label className="mb-1 mt-4 block text-sm font-medium text-black dark:text-white">
                Description:
              </label>
              <textarea
                value={newProduct.txt_mo_ta}
                rows={6}
                placeholder="Describe your product"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, txt_mo_ta: e.target.value })
                }
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
              <div className="flex w-full justify-end">
                <button
                  type="submit"
                  className="mt-4 rounded bg-blue-500 p-2 text-white"
                >
                  Add Product
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddItemForm;
