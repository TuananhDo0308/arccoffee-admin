"use client"

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent } from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import { Edit, Trash2 } from 'lucide-react';

import { httpClient, clientLinks } from "@/utils";
import { setCategories } from "@/slices/category/category";
import AddCategoryForm from "./addCategory";
import EditCategoryForm from "./editCategory";
 
export default function CategorySection() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = useAppSelector((state) => state.auth.token.accessToken);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await httpClient.get({ 
        url: clientLinks.category.getCategory,
      });
      const data = response.data.data.data;
      console.log('Fetched categories:', data);
      if (data.length === 0) {
        setErrorMessage("No categories found.");
      }
      dispatch(setCategories(data));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setErrorMessage("Error fetching categories.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await httpClient.delete({
        url: clientLinks.category.deleteCategory(categoryId),
        token: token,
      });
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSkeletons = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {[...Array(2)].map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="w-full h-8 rounded-lg"/>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-2xl font-bold">Category Management</h4>
        <Button color="primary" onPress={() => setShowAddModal(true)}>Add Category</Button>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        {isLoading ? (
          <Table aria-label="Category table">
            <TableHeader>
              <TableColumn>Category Name</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {renderSkeletons()}
            </TableBody>
          </Table>
        ) : errorMessage ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">{errorMessage}</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <Table aria-label="Category table">
            <TableHeader>
              <TableColumn>Category Name</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button isIconOnly variant="light" onPress={() => setEditingCategory(category)}>
                        <Edit size={20} />
                      </Button>
                      <Button isIconOnly variant="light" onPress={() => handleDeleteCategory(category.id)}>
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">No categories found.</p>
          </div>
        )}

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <ModalContent>
            <AddCategoryForm onClose={() => setShowAddModal(false)} onSuccess={fetchCategories} />
          </ModalContent>
        </Modal>

        <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)}>
          <ModalContent>
            {editingCategory && (
              <EditCategoryForm category={editingCategory} onClose={() => setEditingCategory(null)} onSuccess={fetchCategories} />
            )}
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
