import React from "react";

interface Product {
  str_masp: string;
  str_tensp: string;
  d_don_gia: number;
  i_so_luong: number;
}

interface ProductTableProps {
  products: Product[];
  onAddToRestock: (productId: string) => void;
  quantities: { [productId: string]: number };
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onAddToRestock,
  quantities,
}) => {
  return (
    <div className="product-selection mt-8">
      <h2 className="text-2xl font-semibold text-black dark:text-white">Select Products to Restock</h2>
      <table className="product-table min-w-full bg-white border border-gray-200 shadow-lg rounded-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Product Name</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Price</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Stock</th>
            <th className="text-left py-2 px-4 font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.str_masp} className="border-t">
              <td className="py-4 px-4">{product.str_tensp}</td>
              <td className="py-4 px-4">${product.d_don_gia.toFixed(2)}</td>
              <td className="py-4 px-4">{product.i_so_luong}</td>
              <td className="py-4 px-4">
                <button
                  onClick={() => onAddToRestock(product.str_masp)}
                  className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                  disabled={!!quantities[product.str_masp]} // Disable if the item is already added
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
