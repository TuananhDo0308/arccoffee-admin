"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import defaultIMG from "@/assets/cog.png"; // Đảm bảo tệp này tồn tại
import { useAppSelector } from "@/hooks/hook"; // Đảm bảo đường dẫn đúng
import { apiLinks, clientLinks, httpClient } from "@/utils";

// Định nghĩa giao diện cho sản phẩm
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryName: string;
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa giao diện cho props của component
interface DetailProductProps {
  product: Product;
  onClose: () => void;
  onSave: () => void;
}

const DetailProduct: React.FC<DetailProductProps> = ({ product, onClose, onSave }) => {
  console.log("DetailProduct Component Mounted");
  console.log("Received product prop:", product);

  const categories = useAppSelector((state) => state.category.categories);
  const token = useAppSelector(state => state.auth.token.accessToken)
  console.log("Fetched categories from state:", categories);

  // Định nghĩa trạng thái form
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryName: product.categoryName,
    image: null as File | null,
  });

  // Trạng thái để hiển thị hình ảnh preview
  const [imagePreview, setImagePreview] = useState<string>(
    product.image ? product.image : defaultIMG.src
  );

  console.log("Initial imagePreview state:", imagePreview);

  // Cập nhật formData khi product thay đổi
  useEffect(() => {
    console.log("useEffect triggered: product changed");
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryName: product.categoryName,
      image: null,
    });
    setImagePreview(product.image ? product.image : defaultIMG.src);
    console.log("Form data and imagePreview reset to:", {
      ...formData,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryName: product.categoryName,
      image: null,
    });
  }, [product]);

  // Hàm xử lý thay đổi các trường nhập liệu
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
    console.log(`Updated formData field ${name}:`, value);
  };

  // Hàm xử lý thay đổi hình ảnh
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          console.log("Updated imagePreview state with new image:", reader.result);
        }
      };
      reader.onerror = () => {
        console.error("FileReader encountered an error");
      };
      reader.readAsDataURL(file);
      console.log("FileReader started reading the file");
    } else {
      // Nếu không chọn file, đặt lại hình ảnh về mặc định
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
      setImagePreview(product.image ? product.image : defaultIMG.src);
      console.log("No file selected. Reset imagePreview to:", product.image ? product.image : defaultIMG.src);
    }
  };

  // Hàm xử lý submit form
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submission started with data:", formData);

    try {
      const submitFormData = new FormData();
      submitFormData.append("id", formData.id);
      submitFormData.append("Name", formData.name);
      submitFormData.append("Description", formData.description);
      submitFormData.append("Price", formData.price.toString());
      submitFormData.append("Stock", formData.stock.toString());

      // Tìm CategoryId dựa trên categoryName
      const category = categories.find(cat => cat.name === formData.categoryName);
      if (category) {
        submitFormData.append("CategoryId", category.id);
        console.log("Appended CategoryId:", category.id);
      } else {
        console.error("Category not found for categoryName:", formData.categoryName);
        alert("Invalid category selected.");
        return;
      }

      // Append image chỉ nếu có file mới được chọn
      if (formData.image) {
        submitFormData.append("Image", formData.image);
        console.log("Appended Image file:", formData.image);
      } else {
        console.log("No new image to append");
      }

      console.log("FormData ready for submission");
      try {
        const response = await httpClient.put({
          url: clientLinks.product.editProduct(formData.id),
          data: submitFormData,
          contentType: 'multipart/form-data',
          token: token,
        })

        console.log("response: ", response)

      } catch (error) {
        console.error("editProduct error: ", error)
      }

      onSave();
      onClose(); // Đóng modal sau khi lưu
      console.log("onClose called to close the modal");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  // Hàm xử lý Cancel: Reset form và đóng modal
  const handleCancel = () => {
    console.log("handleCancel triggered");
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryName: product.categoryName,
      image: null,
    });
    setImagePreview(product.image ? product.image : defaultIMG.src);
    console.log("Form data and imagePreview reset to:", {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryName: product.categoryName,
      image: null,
    });
    onClose();
    console.log("onClose called to close the modal on cancel");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <form onSubmit={handleSubmitForm} className="w-full flex">
          {/* Bên trái: Tải lên hình ảnh */}
          <div className="w-1/3 pr-6 flex flex-col items-center">
            <label className="text-gray-700 block text-lg font-bold mb-4">
              Product Image
            </label>
            <div className="w-full flex flex-col items-center">
              <Image
                src={imagePreview}
                alt="Product Image Preview"
                className="mb-4 rounded"
                width={250}
                height={250}
                onLoadingComplete={() => console.log("Image loaded successfully")}
                onError={() => console.error("Failed to load image:", imagePreview)}
              />
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-transparent outline-none transition file:cursor-pointer file:border-0 file:bg-white file:px-5 file:py-3 file:text-gray-700"
                onChange={handleImageChange}
              />
              {/* Không cần hiển thị lỗi cho hình ảnh */}
            </div>
          </div>

          {/* Bên phải: Chi tiết sản phẩm */}
          <div className="w-2/3 pl-6">
            {/* Tên sản phẩm và Giá */}
            <div className="flex justify-between mb-4">
              <div className="w-3/5">
                <label className="text-gray-700 block text-lg font-bold">
                  Product Name
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-2/5 pl-2">
                <label className="text-gray-700 block text-lg font-bold">
                  Price
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Số lượng và Danh mục */}
            <div className="flex justify-between mb-4">
              <div className="w-1/2 px-2">
                <label className="text-gray-700 block text-lg font-bold">
                  Stock
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className="w-1/2 px-2">
                <label className="text-gray-700 block text-lg font-bold">
                  Category
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mô tả */}
            <div className="mb-4">
              <label className="text-gray-700 block text-lg font-bold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
                required
              ></textarea>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-full bg-red px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DetailProduct;
