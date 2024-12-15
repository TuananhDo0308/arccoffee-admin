"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/context/AuthContext";
import { getProducts, getCategories } from "@/API/productAPI";
import Image from "next/image";
import { IMG_URL } from "@/API/LinkAPI";
import OrderTable from "./ProcessingOrder/Process";
import { getSupplier } from "@/API/productAPI";
import { getProcessingOrder } from "@/API/orderAPI";
import CompletedOrderTable from "./CompletedOrder/completedOrder";
const ProductPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeSection, setActiveSection] = useState<string>("process");
    const [suppliers, setSuppliers]= useState<any[]>([]);
    
  
    return (
      <DefaultLayout>
        <div className="mb-4 flex gap-3">
          <button 
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => setActiveSection("process")}
          >
            Processing Order
          </button>
          <button 
              className="inline-flex items-center justify-center rounded-full bg-meta-3 px-5 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => setActiveSection("complete")}
          >
            Completed Order
          </button>
          
        </div>
  
        {activeSection === "process" && (
          <div>
            <OrderTable/>
          </div>
        )}
        {activeSection === "complete" && (
          <div>
            <CompletedOrderTable/>
          </div>
        )}
      </DefaultLayout>
    );
  };
  
export default ProductPage;