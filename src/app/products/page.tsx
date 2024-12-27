"use client"

import React, { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Button, ButtonGroup } from "@nextui-org/button";
import { useAppDispatch } from "@/hooks/hook";
import { httpClient, clientLinks } from "@/utils";
import { setCategories } from "@/slices/category/category";
import { setProducts } from "@/slices/product/product";
import ProductSection from "./productSection/productSection";
import CategorySection from "./categorySection/catergorySection";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function ProductPage() {
  const [activeSection, setActiveSection] = useState<string>("products");
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await httpClient.get({
        url: clientLinks.product.getProductAll,
      });
      dispatch(setProducts(response.data.data));
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await httpClient.get({
        url: clientLinks.category.getCategory,
      });
      dispatch(setCategories(response.data.data));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  return (
    <NextUIProvider>
      <DefaultLayout>
      <Breadcrumb pageName="Product" />

        <div className="space-y-6 w-full ">
          <ButtonGroup>
            <Button
              color={activeSection === "products" ? "primary" : "default"}
              onClick={() => setActiveSection("products")}
            >
              Products
            </Button>
            <Button
              color={activeSection === "categories" ? "primary" : "default"}
              onClick={() => setActiveSection("categories")}
            >
              Categories
            </Button>
          
          </ButtonGroup>

          {activeSection === "products" && <ProductSection />}
          {activeSection === "categories" && <CategorySection />}
        </div>
      </DefaultLayout>
    </NextUIProvider>
  );
}

