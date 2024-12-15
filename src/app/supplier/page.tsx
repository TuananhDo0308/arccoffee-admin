"use client";
import React, { useState, useEffect } from "react";
import { getSupplier, getProductsBySupplier, newImport } from "@/API/productAPI";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ListSupplier from "./listSupplier/listSupplier";
import ProductTable from "./listSupplier/productTable";
import RestockSidebar  from "./listSupplier/restock";// Import the RestockSidebar component

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({}); 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getSupplier();
      setSuppliers(response.listSup); 
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleSupplierClick = async (supplierId: string) => {
    try {
      const response = await getProductsBySupplier(supplierId);
      setProducts(response.list); 
      setSelectedSupplier(supplierId);
      setQuantities({});
      setIsSidebarVisible(false); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToRestock = (productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] ? prevQuantities[productId] + 1 : 1,
    }));
    setIsSidebarVisible(true); 
  };

  const handleRemoveFromRestock = (productId: string) => {
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);
    
    if (Object.keys(updatedQuantities).length === 0) {
      setIsSidebarVisible(false); 
      setSelectedSupplier(null); 
    }
  };

  const calculateTotalPrice = () => {
    return Object.keys(quantities).reduce((total, productId) => {
      const product = products.find((p) => p.str_masp === productId);
      if (product) {
        return total + product.d_don_gia * quantities[productId];
      }
      return total;
    }, 0);
  };

  const handleRestock = async () => {
    const totalPrice = calculateTotalPrice();
    const productsToRestock = Object.keys(quantities).map((productId) => {
      const product = products.find((p) => p.str_masp === productId);
      return {
        productId: product.str_masp,
        quantity: quantities[productId],
      };
    });

    try {
      const response = await newImport(selectedSupplier, totalPrice, productsToRestock);
      alert("Restocking order placed!");
      setQuantities({});
      setIsSidebarVisible(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Error placing restocking order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <div className="flex">
        <div className="flex-grow supplier-page p-4">
          <h1 className="text-3xl font-semibold text-black dark:text-white">Suppliers</h1>
          <ListSupplier 
            suppliers={suppliers} 
            selectedSupplier={selectedSupplier} 
            onSupplierClick={handleSupplierClick} 
            isDisabled={!!Object.keys(quantities).length} 
          />

          {selectedSupplier && (
            <ProductTable
              products={products}
              onAddToRestock={handleAddToRestock} 
              quantities={quantities}
            />
          )}
        </div>

        {/* Sidebar */}
        {isSidebarVisible && (
          <RestockSidebar
            products={products}
            quantities={quantities}
            onQuantityChange={(productId, quantity) => 
              setQuantities({
                ...quantities,
                [productId]: quantity,
              })
            }
            onRemoveFromRestock={handleRemoveFromRestock}
            calculateTotalPrice={calculateTotalPrice}
            handleRestock={handleRestock}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default SupplierPage;
