"use client"
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getProducts, getCategories, getSupplier } from "@/API/productAPI";
import ProductSection from "@/app/products/productSection/productSection";
import AddItemForm from "./productSection/addItemSection";
import CategorySection from "./categorySection/catergorySection";
import SupplierSection from "./supplierSection/supplierSection";
import AddSupplierForm from "./supplierSection/addSupplierSection";
import { clientLinks, httpClient } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { setCategory, setFilteredProducts, setProducts } from "@/slices/product/product";
import { all } from "axios";

// This function will run on the server
export default function ProductPage() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Gọi API để lấy dữ liệu admin
        const response = await httpClient.get({
          url: clientLinks.homepage.product,
        });

        const productData = response.data
        // Cập nhật state với dữ liệu trả về
        dispatch(setProducts(productData))
        dispatch(setFilteredProducts(productData))
        dispatch(setCategory("all"))
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
      }
    };

    fetchAdminData(); // Gọi hàm fetchAdminData khi component mount
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component mount

  // Fetch data from API
  const productsData = getProducts();
  const categoriesData = getCategories();
  const suppliersData = getSupplier();

  // const initialProducts = productsData.list || [];
  const initialCategories = categoriesData.list || [];
  const initialSuppliers = suppliersData.listSup || [];

  // const [categories, setCategories] = useState(initialCategories);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [activeSection, setActiveSection] = useState<string>("products");

  return (
    <DefaultLayout>
      <div className="mb-4 flex gap-3">
        <button
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setActiveSection("products")}
        >
          Product
        </button>
        <button
          className="inline-flex items-center justify-center rounded-full bg-meta-3 px-5 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setActiveSection("categories")}
        >
          Category
        </button>
        <button
          className="inline-flex items-center justify-center rounded-full bg-meta-6 px-5 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={() => setActiveSection("suppliers")}
        >
          Supplier
        </button>
      </div>

      {activeSection === "products" && (
        <div>
          {/* <AddItemForm addItem={addItem} categories={categories} suppliers={suppliers} /> */}
          <ProductSection suppliers={suppliers} />
        </div>
      )}
      {activeSection === "categories" && (
        <div>
          <CategorySection categories={categories} setCategories={setCategories} />
        </div>
      )}
      {activeSection === "suppliers" && (
        <div>
          {/* <AddSupplierForm addSupplier={addSupplier} /> */}
          <SupplierSection suppliers={suppliers} setSuppliers={setSuppliers} />
        </div>
      )}
    </DefaultLayout>
  );
}
