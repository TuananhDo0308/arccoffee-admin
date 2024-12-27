"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/hooks/hook";
import httpClient from "@/utils/http-client"; // Đường dẫn đến httpClient của bạn
import { clientLinks } from "@/utils"; // Đường dẫn API
import defaultIMG from "@/assets/cog.png"; // Import hình ảnh mặc định
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { filterByCategory, setProducts } from "@/slices/product/product";
import { useDispatch } from "react-redux";

interface Product {
  id: number;              // ID sản phẩm (sẽ được backend cung cấp)
  name: string;            // Tên sản phẩm
  description: string;     // Mô tả sản phẩm
  price: number;           // Giá sản phẩm
  stock: number;           // Số lượng tồn kho
  image: File | string;    // Ảnh sản phẩm (File khi gửi, string khi nhận)
  categoryId: string;      // ID danh mục (UUID)
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa schema validation với Yup
const schema = yup.object().shape({
  name: yup.string().required("Tên sản phẩm là bắt buộc"),
  description: yup.string().required("Mô tả sản phẩm là bắt buộc"),
  price: yup.number().typeError("Giá phải là số").positive("Giá phải dương").required("Giá là bắt buộc"),
  stock: yup.number().typeError("Số lượng phải là số").integer("Số lượng phải là số nguyên").min(0, "Số lượng không thể âm").required("Số lượng là bắt buộc"),
  image: yup
    .mixed()
    .required("Ảnh sản phẩm là bắt buộc")
    .test("fileSize", "Kích thước file quá lớn", value => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Chỉ chấp nhận các định dạng: jpg, jpeg, png", value => {
      return value && value[0] && ['image/jpeg', 'image/jpg', 'image/png'].includes(value[0].type);
    }),
  categoryId: yup.string().required("Danh mục là bắt buộc"),
});

type FormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: FileList;
  categoryId: string;
};

const AddItemForm: React.FC = () => {
  // Lấy danh sách danh mục từ Redux store
  const categories = useAppSelector(state => state.category.categories);
  // Lấy token từ Redux store
  const token = useAppSelector(state => state.auth.token.accessToken);

  // Trạng thái để hiển thị hình ảnh preview
  const [imagePreview, setImagePreview] = useState<string>(defaultIMG.src);
  // Trạng thái để hiển thị/ẩn form
  const [showForm, setShowForm] = useState(false);
  // Trạng thái để hiển thị thông báo thành công hoặc lỗi
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sử dụng React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(defaultIMG.src);
    }
  };

  const dispatch = useDispatch();
  const fetchAdminProduct = async () => {
    try {
      const response = await httpClient.get({
        url: clientLinks.product.getProductAll,
      });

      const productData = response.data;

      dispatch(setProducts(productData.data))
      dispatch(filterByCategory("all"))
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
    }
  };
 

  // Xử lý khi người dùng submit form
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Tạo FormData từ dữ liệu form
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("Price", data.price.toString());
    formData.append("Stock", data.stock.toString());
    formData.append("CategoryId", data.categoryId);
    formData.append("Image", data.image[0], data.image[0].name);
    console.log("formData: ", formData)
    
    try {
      // Gửi FormData thông qua httpClient.post
      const response = await httpClient.post({
        url: clientLinks.product.addProduct,
        token: token,
        data: formData,
        contentType: "multipart/form-data",

      });

      console.log('Thêm sản phẩm thành công:', response.data);
      setSubmissionStatus({ type: 'success', message: 'Thêm sản phẩm thành công!' });
      fetchAdminProduct();
      // Reset form và hình ảnh preview
      reset();
      setImagePreview(defaultIMG.src);
      setShowForm(false);
    } catch (error: any) {
      console.error("Failed to add item:", error);
      setSubmissionStatus({ type: 'error', message: error.response?.data?.message || 'Thêm sản phẩm thất bại. Vui lòng thử lại.' });
    }
  };
  
  return (
    <>
      {/* Nút để hiển thị/ẩn form */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary p-3 text-center text-3xl font-extrabold text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          +
        </button>
      </div>

      {/* Thông báo sau khi submit */}
      {submissionStatus && (
        <div
          className={`mb-4 p-4 rounded shadow ${submissionStatus.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {submissionStatus.message}
        </div>
      )}

      {/* Form thêm sản phẩm */}
      {showForm && (
        <div className="my-6 flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-4xl bg-white dark:bg-boxdark border border-stroke rounded-lg shadow-lg p-8 space-y-6"
          >
            {/* Trường Image */}
            <div className="flex flex-col items-center">
              <label className="mb-2 text-sm font-medium text-black dark:text-white">
                Image:
              </label>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="mb-4 rounded-md"
                  width={200}
                  height={200}
                />
              )}
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-900 bg-transparent border border-stroke rounded-lg cursor-pointer focus:outline-none hover:bg-primary hover:bg-opacity-10 transition-colors duration-200 dark:border-form-strokedark dark:text-white"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>

            {/* Trường Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Name:
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-stroke rounded-lg focus:border-primary focus:ring-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Trường Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Description:
              </label>
              <textarea
                {...register("description")}
                placeholder="Describe your product"
                rows={4}
                className="w-full px-4 py-2 border border-stroke rounded-lg focus:border-primary focus:ring-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Trường Price và Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trường Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Price:
                </label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border border-stroke rounded-lg focus:border-primary focus:ring-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Trường Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Stock:
                </label>
                <input
                  type="number"
                  {...register("stock")}
                  placeholder="Enter stock quantity"
                  className="w-full px-4 py-2 border border-stroke rounded-lg focus:border-primary focus:ring-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Trường CategoryId */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Category:
              </label>
              <select
                {...register("categoryId")}
                className="w-full px-4 py-2 border border-stroke rounded-lg bg-transparent focus:border-primary focus:ring-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Nút Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddItemForm;
