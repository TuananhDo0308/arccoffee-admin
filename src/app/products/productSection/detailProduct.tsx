"use client"

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { httpClient, clientLinks } from "@/utils";
import { setProducts } from "@/slices/product/product";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import Image from "next/image";

const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().positive("Price must be positive").required("Price is required"),
  stock: yup.number().integer("Stock must be an integer").min(0, "Stock cannot be negative").required("Stock is required"),
  categoryId: yup.string().required("Category is required"),
  image: yup.mixed()
    .test("fileSize", "File size is too large", (value) => {
      return !value || (value && value[0]?.size <= 5000000);
    })
    .test("fileType", "Unsupported file format", (value) => {
      return !value || (value && ["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type));
    }),
});

export default function EditProductForm({ product, onClose, onSuccess }) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.categories);
  const token = useAppSelector(state => state.auth.token.accessToken);
  const [imagePreview, setImagePreview] = useState(product.image);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const fileInputRef = useRef(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    }
  });

  useEffect(() => {
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("stock", product.stock);
    
    // Find the category ID based on the category name
    const category = categories.find(cat => cat.name === product.categoryName);
    if (category) {
      setValue("categoryId", category.id);
    }
  }, [product, categories, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true before API call
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        if (data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await httpClient.put({
        url: clientLinks.product.editProduct(product.id),
        token,
        data: formData,
        contentType: "multipart/form-data",
      });

      dispatch(setProducts(response.data.data));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setIsLoading(false); // Set loading to false after API call, regardless of success or failure
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("image", e.target.files);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <ModalHeader>
        <h4 className="text-2xl font-bold">Edit Product</h4>
      </ModalHeader>
      <ModalBody>
        <div className="flex justify-center mb-4">
          <Image
            src={imagePreview}
            alt="Product"
            width={200}
            height={200}
            className="rounded-md cursor-pointer"
            onClick={handleImageClick}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Product Name"
                placeholder="Enter product name"
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Description"
                placeholder="Enter product description"
                errorMessage={errors.description?.message}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Price"
                  placeholder="Enter price"
                  errorMessage={errors.price?.message}
                />
              )}
            />

            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Stock"
                  placeholder="Enter stock"
                  errorMessage={errors.stock?.message}
                />
              )}
            />
          </div>

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Category"
                placeholder="Select a category"
                selectedKeys={[field.value]}
                errorMessage={errors.categoryId?.message}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                label="Product Image"
                placeholder="Upload product image"
                errorMessage={errors.image?.message}
                onChange={(e) => {
                  field.onChange(e.target.files);
                  handleImageChange(e);
                }}
                ref={fileInputRef}
                className="hidden"
              />
            )}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
        <Button color="primary" onPress={handleSubmit(onSubmit)} isLoading={isLoading}> {/* Updated button */}
          {isLoading ? 'Updating...' : 'Update Product'}
        </Button>
      </ModalFooter>
    </>
  );
}

