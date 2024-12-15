"use client";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Material-UI Delete Icon

interface RestockSidebarProps {
  products: any[];
  quantities: { [productId: string]: number };
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveFromRestock: (productId: string) => void;
  calculateTotalPrice: () => number;
  handleRestock: () => void;
}

const RestockSidebar: React.FC<RestockSidebarProps> = ({
  products,
  quantities,
  onQuantityChange,
  onRemoveFromRestock,
  calculateTotalPrice,
  handleRestock,
}) => {
  return (
    <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Restock Items</h2>
      <ul>
        {Object.keys(quantities).map((productId) => {
          const product = products.find((p) => p.str_masp === productId);
          return (
            <li key={productId} className="flex justify-between items-center mb-2">
              <span>{product.str_tensp}</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={quantities[productId]}
                  onChange={(e) =>
                    onQuantityChange(productId, parseInt(e.target.value, 10))
                  }
                  className="border rounded px-2 py-1 mr-2 w-20"
                />
                <button
                  onClick={() => onRemoveFromRestock(productId)}
                  className="text-red-500"
                >
                  <DeleteIcon />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <p className="font-semibold text-lg">Total Price: ${calculateTotalPrice().toFixed(2)}</p>
      </div>
      <button
        onClick={handleRestock}
        className="mt-4 w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        Place Order
      </button>
    </div>
  );
};

export default RestockSidebar;
