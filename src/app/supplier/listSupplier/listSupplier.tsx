import React from "react";

interface Supplier {
  str_mancc: string;
  str_tenncc: string;
}

interface ListSupplierProps {
  suppliers: Supplier[];
  selectedSupplier: string | null;
  onSupplierClick: (supplierId: string) => void;
}

const ListSupplier: React.FC<ListSupplierProps> = ({ suppliers, selectedSupplier, onSupplierClick }) => {
  return (
    <div className="supplier-list flex flex-wrap gap-4 mt-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier.str_mancc}
          onClick={() => onSupplierClick(supplier.str_mancc)}
          className={`supplier-item cursor-pointer inline-flex items-center justify-center rounded-full px-5 py-4 text-center font-medium text-white ${
            selectedSupplier === supplier.str_mancc ? "bg-blue-700" : "bg-primary hover:bg-blue-500 transition"
          }`}
        >
          {supplier.str_tenncc}
        </div>
      ))}
    </div>
  );
};

export default ListSupplier;
