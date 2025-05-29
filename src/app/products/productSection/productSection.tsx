"use client"

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Modal, ModalContent } from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import { Edit, EyeOff, Eye } from 'lucide-react';

import { httpClient, clientLinks } from "@/utils";
import { setProducts } from "@/slices/product/product";
import AddProductForm from "./addItemSection";
import EditProductForm from "./detailProduct";

export default function ProductSection() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.filteredProducts);
  const categories = useAppSelector((state) => state.category.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Added error message state

  const token = useAppSelector((state) => state.auth.token.accessToken);

  useEffect(() => {
    fetchProducts();
  }, [selectedStatus]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setErrorMessage(""); // Clear error message before fetching
    try {
      let data = null;
      if (selectedStatus === "available") {
        const response = await httpClient.get({ 
          url: clientLinks.product.getProductAvailable,
        });
        data = response.data.data.data;
      } else if (selectedStatus === "hidden") {
        const response = await httpClient.get({ 
          url: clientLinks.product.getProductHidden,
          token: token,
        });
        data = response.data.data.data;
      } else {
        const response = await httpClient.get({ 
          url: clientLinks.product.getProductAll,
        });
        data = response.data.data.data;
      }
      
      dispatch(setProducts(data));
    } catch (err) {
      console.error('Error fetching products:', err);
      setErrorMessage("No products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHideProduct = async (productId) => {
    try {
      await httpClient.patch({
        url: clientLinks.product.updateProductStatus(productId),
        token: token,
      });
      fetchProducts();
    } catch (err) {
      console.error('Error hiding product:', err);
    }
  };

  const handleShowProduct = async (productId) => {
    try {
      await httpClient.patch({
        url: clientLinks.product.updateProductStatus(productId),
        token: token,
      });
      fetchProducts();
    } catch (err) {
      console.error('Error showing product:', err);
    }
  };
  const filteredProducts = Array.isArray(products) 
  ? products.filter((product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.categoryName === selectedCategory)
    ) 
  : [];


  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const renderSkeletons = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {[...Array(5)].map((_, cellIndex) => (
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
        <h4 className="text-2xl font-bold">Product Management</h4>
        <Button color="primary" onPress={() => setShowAddModal(true)}>Add Product</Button>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between mb-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              placeholder="Select category"
              selectedKeys={[selectedCategory]}
              onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
            >
              <SelectItem key="all" value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Select status"
              selectedKeys={[selectedStatus]}
              onSelectionChange={(keys) => handleStatusChange(Array.from(keys)[0] as string)}
            >
              <SelectItem key="all" value="all">All Status</SelectItem>
              <SelectItem key="available" value="available">Available</SelectItem>
              <SelectItem key="hidden" value="hidden">Hidden</SelectItem>
            </Select>
          </div>
        </div>

        {isLoading||filteredProducts.length===0 ? (
          <Table aria-label="Product table">
            <TableHeader>
              <TableColumn>Product</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Stock</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {renderSkeletons()}
            </TableBody>
          </Table>
        ) : errorMessage ? ( // Updated conditional rendering
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">{errorMessage}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <Table aria-label="Product table">
            <TableHeader>
              <TableColumn>Product</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Stock</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{product.price.toLocaleString()} VND</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button isIconOnly variant="light" onPress={() => setEditingProduct(product)}>
                        <Edit size={20} />
                      </Button>
                      {selectedStatus !== "all" && (
                        selectedStatus === "available" ? (
                          <Button isIconOnly variant="light" onPress={() => handleHideProduct(product.id)}>
                            <EyeOff size={20} />
                          </Button>
                        ) : (
                          <Button isIconOnly variant="light" onPress={() => handleShowProduct(product.id)}>
                            <Eye size={20} />
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">No products found.</p>
          </div>
        )}

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <ModalContent>
            <AddProductForm onClose={() => setShowAddModal(false)} onSuccess={fetchProducts} />
          </ModalContent>
        </Modal>

        <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
          <ModalContent>
            {editingProduct && (
              <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} onSuccess={fetchProducts} />
            )}
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}

