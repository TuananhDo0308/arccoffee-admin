"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { IMG_URL } from "@/API/LinkAPI";
import { updateProduct } from "@/API/productAPI";
import defaultIMG from "@/assets/cog.png"; // Use your own default image

export default function DetailProduct({
  product,
  categories,
  suppliers,
  onClose,
  onSave,
}: {
  product: any;
  categories: any[];
  suppliers: any[];
  onClose: any;
  onSave: any;
}) {
  const methods = useForm({
    defaultValues: {
      str_tensp: product?.str_tensp || "",
      d_don_gia: product?.d_don_gia || 0,
      i_so_luong: product?.i_so_luong || 0,
      str_malh: product?.str_malh || "",
      str_mancc: product?.str_mancc || "",
      txt_mo_ta: product?.txt_mo_ta || "",
    },
    mode: "onTouched",
  });

  const { handleSubmit, setValue, watch } = methods;
  const [imagePreview, setImagePreview] = useState(
    product?.strimg ? `${IMG_URL}/${product.strimg}` : defaultIMG.src
  ); // Preview image

  const handleProfilePictureChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profilePicture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Update preview with selected image
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("productId", product.str_masp);
      formData.append("newName", data.str_tensp);
      formData.append("price", data.d_don_gia);
      formData.append("quantity", product.i_so_luong);
      formData.append("categoryId", data.str_malh);
      formData.append("supplierId", data.str_mancc);
      formData.append("description", data.txt_mo_ta);

      // Append image only if a new file is selected
      if (data.profilePicture instanceof File) {
        formData.append("profilePicture", data.profilePicture);
      }
      const response = await updateProduct(formData);
      console.log(response.product);
      onSave(response.product);

      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative flex w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex">
            {/* Left side: Image Upload */}
            <div className="w-1/3 pr-6 flex flex-col items-center">
              <label className="text-gray-700 block text-lg font-bold mb-4">
                Product Image
              </label>
              <div className="w-full flex flex-col items-center">
                <Image
                  src={imagePreview}
                  alt="Product Image Preview"
                  className="mb-4"
                  width={250}
                  height={250}
                />
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  onChange={handleProfilePictureChange}
                />
              </div>
            </div>

            {/* Right side: Product Details */}
            <div className="w-2/3 pl-6">
              {/* Product Name and Price */}
              <div className="flex justify-between mb-4">
                <div className="w-3/5">
                  <label className="text-gray-700 block text-lg font-bold">
                    Product Name
                  </label>
                  <input
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    type="text"
                    {...methods.register("str_tensp")}
                  />
                </div>
                <div className="w-2/5 pl-2">
                  <label className="text-gray-700 block text-lg font-bold">
                    Price
                  </label>
                  <input
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    type="number"
                    {...methods.register("d_don_gia")}
                  />
                </div>
              </div>

              {/* Quantity, Category, and Supplier */}
              <div className="flex justify-between mb-4">
                
                <div className="w-1/2 px-2">
                  <label className="text-gray-700 block text-lg font-bold">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    {...methods.register("str_malh")}
                  >
                    {categories.map((cat) => (
                      <option key={cat.str_malh} value={cat.str_malh}>
                        {cat.str_tenlh}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2 pl-2">
                  <label className="text-gray-700 block text-lg font-bold">
                    Supplier
                  </label>
                  <select
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    {...methods.register("str_mancc")}
                  >
                    {suppliers.map((sup) => (
                      <option key={sup.str_mancc} value={sup.str_mancc}>
                        {sup.str_tenncc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Input */}
              <div className="mb-4">
                <label className="text-gray-700 block text-lg font-bold">
                  Description
                </label>
                <textarea
                  {...methods.register("txt_mo_ta")}
                  rows={4}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full bg-meta-1  px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-primary  px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
