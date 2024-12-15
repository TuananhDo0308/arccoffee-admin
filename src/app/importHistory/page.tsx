"use client"
import React, { useState, useEffect } from "react";
import { getImport } from "@/API/orderAPI";
import { getSupplier } from "@/API/productAPI"; // Import the getSupplier API
import ImportDetail from "./detail/detailHistory"; // Import the ImportDetail component
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const ImportHistory = () => {
  const [importData, setImportData] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedImportId, setSelectedImportId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch import data
        const importResponse = await getImport();
        setImportData(importResponse);

        // Fetch supplier data
        const supplierResponse = await getSupplier();
        setSuppliers(supplierResponse.listSup); // Adjust according to your API structure
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to get the supplier name by ID
  const getSupplierNameById = (supplierId: string) => {
    const supplier = suppliers.find((sup) => sup.str_mancc === supplierId);
    return supplier ? supplier.str_tenncc : "Unknown Supplier";
  };

  return (
    <DefaultLayout>
      <h1>Import History</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Import ID</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Supplier</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Total Price</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Import Date</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {importData.map((importItem) => (
            <tr key={importItem.str_mank} className="border-t">
              <td className="py-4 px-4">{importItem.str_mank}</td>
              <td className="py-4 px-4">{getSupplierNameById(importItem.str_mancc)}</td> {/* Display supplier name */}
              <td className="py-4 px-4">${importItem.d_tong_tien}</td>
              <td className="py-4 px-4">{new Date(importItem.date_ngay_nhap).toLocaleDateString()}</td>
              <td className="py-4 px-4">
                <button
                  onClick={() => setSelectedImportId(importItem.str_mank)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedImportId && (
        <ImportDetail
          importId={selectedImportId}
          onClose={() => setSelectedImportId(null)}
          suppliers={suppliers}
        />
      )}
    </DefaultLayout>
  );
};

export default ImportHistory;
