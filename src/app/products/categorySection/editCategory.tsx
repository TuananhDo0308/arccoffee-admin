"use client"

import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { httpClient, clientLinks } from "@/utils";
import { useAppSelector } from "@/hooks/hook";

export default function EditCategoryForm({ category, onClose, onSuccess }) {
  const [categoryName, setCategoryName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token.accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await httpClient.patch({
        url: clientLinks.category.editCategory(category.id),
        data: { name: categoryName },
        token: token,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <Input
        label="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        required
        className="mb-4"
      />
      <div className="flex justify-end space-x-2">
        <Button color="danger" variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Update Category
        </Button>
      </div>
    </form>
  );
}

