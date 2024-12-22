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
import { object } from "yup";
import { setCategories } from "@/slices/category/category";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;              // ID sản phẩm
  name: string;            // Tên sản phẩm
  description: string,
  price: number,
  stock: number,
  image: string,
  categoryName: string;    // Tên danh mục
  // Thêm các thuộc tính khác nếu cần
}

// This function will run on the server
export default function ProductPage() {
  const dispatch = useAppDispatch();

  const fetchAdminProduct = async () => {
    try {
      // Gọi API để lấy dữ liệu admin
      const response = await httpClient.get({
        url: clientLinks.homepage.product,
      });

      const productData = response.data;

      // // Cập nhật state với dữ liệu trả về
      dispatch(setProducts(productData.data))
      dispatch(setFilteredProducts(productData.data))
      dispatch(setCategory("all"))
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
    }
  };
  const fetchAdminCategory = async () => {
    try {
      const response = await httpClient.get({
        url: clientLinks.homepage.category,  // Endpoint lấy dữ liệu category
      });

      const categoryData = response.data;
      console.log("categoryData: ", categoryData.data)
      // Dispatch action vào Redux để cập nhật dữ liệu category
      dispatch(setCategories(categoryData.data));  // Giả sử bạn lưu category vào state
    } catch (err) {
      console.error('Error fetching category data:', err);
    }
  };

  useEffect(() => {
    fetchAdminProduct(); // Gọi hàm fetchAdminData khi component mount
    fetchAdminCategory();
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
