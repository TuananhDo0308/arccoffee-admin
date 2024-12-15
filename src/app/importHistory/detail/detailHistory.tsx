import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

import { importDetail } from "@/API/orderAPI"; // Import your API function

interface Product {
  str_masp: string;
  str_tensp: string;
}

interface ImportDetailItem {
  i_so_luong: number;
  Product: Product;
}

interface ImportDetailProps {
  importId: string;
  onClose: () => void;
  suppliers:any[]
}

const ImportDetailModal: React.FC<ImportDetailProps> = ({ importId, onClose,suppliers }) => {
  const [detail, setDetail] = useState<any | null>(null);
  const getSupplierNameById = (supplierId: string) => {
    const supplier = suppliers.find((sup) => sup.str_mancc === supplierId);
    return supplier ? supplier.str_tenncc : "Unknown Supplier";
  };
  useEffect(() => {
    const fetchImportDetail = async () => {
      try {
        const data = await importDetail(importId);
        console.log("Import detail data:", data);
        setDetail(data.importDetail);
      } catch (error) {
        console.error("Error fetching import detail:", error);
      }
    };

    if (importId) {
      fetchImportDetail();
    }
  }, [importId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const name=getSupplierNameById(detail.str_mancc)
    doc.setFontSize(20);
    doc.text("Import Details", 14, 22);

    doc.setFontSize(12);
    doc.text(`Import ID: ${detail.str_mank}`, 14, 32);
    doc.text(`Supplier Name: ${detail.str_mancc}`, 14, 40);
    doc.text(`Total Price: $${name}`, 14, 48);
    doc.text(`Import Date: ${new Date(detail.date_ngay_nhap).toLocaleDateString()}`, 14, 56);

    // Create the product table
    doc.autoTable({
      startY: 70, // Set starting Y position
      head: [["Product Name", "Quantity"]],
      body: detail.ImportDetails.map((item: ImportDetailItem) => [
        item.Product.str_tensp,
        item.i_so_luong,
      ]),
    });

    doc.save("import_details.pdf");
  };

  if (!detail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 ml-[290px] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Import Details</h2>
        <p className="mb-4">
          <strong>Import ID:</strong> {detail.str_mank}
        </p>
        <p className="mb-4">
          <strong>Supplier Name:</strong> {getSupplierNameById(detail.str_mancc)}
        </p>
        <p className="mb-4">
          <strong>Total Price:</strong> ${detail.d_tong_tien}
        </p>
        <p className="mb-4">
          <strong>Import Date:</strong> {new Date(detail.date_ngay_nhap).toLocaleDateString()}
        </p>
        <h3 className="mb-2 text-xl font-semibold">Products:</h3>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-2 px-4 font-medium text-gray-600">Product Name</th>
              <th className="text-left py-2 px-4 font-medium text-gray-600">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {detail.ImportDetails.map((item: ImportDetailItem, index: number) => (
              <tr key={index} className="border-t">
                <td className="py-4 px-4">{item.Product.str_tensp}</td>
                <td className="py-4 px-4">{item.i_so_luong}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex space-x-4">
          <button
            className="rounded-full bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-opacity-90"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDetailModal;
