"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IMG_URL } from "@/API/LinkAPI";
import { deleteProduct } from "@/API/productAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Material-UI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import DetailProduct from "./detailProduct";
import { updateProduct } from "@/API/productAPI";
import ConfirmDialog from "@/components/ConfirmBox";
import { useAppSelector } from "@/hooks/hook";
import { httpClient, clientLinks } from "@/utils";
import { CompressSharp } from "@mui/icons-material";

const ProductTable = ({
  suppliers,
}: {
  suppliers: any[];
}) => {
  const { products, filteredProducts } = useAppSelector(state => state.product);
  const categories = useAppSelector(state => (state.category.categories));
  console.log("categories: ", categories)
  // const products = useAppSelector(state => state.product.products);
  // const filteredProducts = useAppSelector(state => state.product.filteredProducts);
  // const productArray = Object.values(filteredProducts);
  // productArray.map((products, index) => (
  //   console.log(`productArray: ${index}`, products)
  // ))

  // console.log("products: ", products)
  // console.log("filteredProducts: ", filteredProducts)
  // console.log("Array.isArray(filteredProducts): ", Array.isArray(filteredProducts))

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null); // Tracks which row's action menu is open
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);


  const handleOpenDetail = (product: any) => {
    setSelectedProduct(product);
    setEditingIndex(null); // Exit edit mode
    console.log(products);
    setShowActions(null);
  };

  //____________________________________ EDIT FUNCTION_______________________________________


  //____________________________________ DELETE FUNCTION_______________________________________

  const handleDelete = async (index: number, productId: string) => {
    setEditingIndex(null);
    setShowActions(null);

    try {
      await deleteProduct({ productId });
      const updatedProducts = products.filter(
        (product) => product.str_masp !== productId,
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  //____________________________________ SAVE DETAIL FUNCTION_______________________________________
  const handleSaveDetail = (updatedProduct: any) => {
    const updatedProducts = products.map((prod) =>
      prod.str_masp === updatedProduct.str_masp ? updatedProduct : prod,
    );
    setProducts(updatedProducts);
    setSelectedProduct(null); // Close the modal after saving
  };

  //____________________________________ SORT FUNCTION_______________________________________
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.str_malh === categoryId);
    return category ? category.str_tenlh : "Unknown";
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((sup) => sup.str_mancc === supplierId);
    return supplier ? supplier.str_tenncc : "Unknown";
  };

  return (
    <div className="rounded-sm border h-full border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Product List
        </h4>
      </div>
      <div className="mb-4 flex justify-between px-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mx-3 w-[500px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className=" mr-4 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          >
            <option value="all">All Status</option>
            <option key='available' value='available'>
              Available
            </option>
            <option key='hidden' value='hidden'>
              Hidden
            </option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className=" mr-4 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Description</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Quantity</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {filteredProducts.map((product, index) => (
        <div
          className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-9 md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={product.image}
                  width={400}
                  height={600}
                  objectFit="cover"
                  alt={product.name}
                />
              </div>
              <p className="text-sm text-black dark:text-white">
                {product.name}
              </p>
            </div>
          </div>

          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.categoryName}
            </p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.description}
            </p>
          </div>

          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              ${product.price}
            </p>
          </div>

          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              {product.stock}
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
                  onClick={() => handleOpenDetail(product)} // Trigger modal on click
                >
                  <EditIcon />
                </IconButton>
                {/* <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(index, product.id)}
                >
                  <DeleteIcon />
                </IconButton> */}
              </div>
            )}
            {/* {selectedProduct && (
              <DetailProduct
                product={selectedProduct}
                categories={categories}
                suppliers={suppliers}
                onSave={handleSaveDetail} // Pass the save handler
                onClose={() => setSelectedProduct(null)}
              />
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;
