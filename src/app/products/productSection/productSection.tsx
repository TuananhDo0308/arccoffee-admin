"use client"

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hook";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import Image from "next/image";
import { Edit, MoreVertical, EyeOff } from 'lucide-react';
import AddProductForm from "./addItemSection";
import EditProductForm from "./detailProduct";
import { httpClient, clientLinks } from "@/utils";
import { setProducts } from "@/slices/product/product";

export default function ProductSection() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.filteredProducts);
  const categories = useAppSelector((state) => state.category.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAppSelector((state) => state.auth.token.accessToken);
  useEffect(() => {
    fetchProducts();
  }, [selectedStatus]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let data=null;
      if (selectedStatus === "available") {
        const response = await httpClient.get({ 
          url : clientLinks.product.getProductAvailable,
        });
        data = response.data;
      } else if (selectedStatus === "hidden") {
        const response = await httpClient.get({ 
          url: clientLinks.product.getProductHidden,
          token: token,
        });
        data = response.data;
      }
      else{
        const response = await httpClient.get({ 
          url: clientLinks.product.getProductAll,
        });
        data = response.data;
      }
      

    
      dispatch(setProducts(data.data));
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || product.categoryName === selectedCategory)
  );

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-2xl font-bold">Product Management</h4>
        <Button color="primary" onPress={() => setShowAddForm(true)}>Add Product</Button>
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
                <SelectItem key={category.id} value={category.name}>
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

        <Table aria-label="Product table">
          <TableHeader>
            <TableColumn>Product</TableColumn>
            <TableColumn>Category</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Stock</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody loadingState={isLoading ? "loading" : "idle"}>
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
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button isIconOnly variant="light" onPress={() => setEditingProduct(product)}>
                      <Edit size={20} />
                    </Button>
                    <Button isIconOnly variant="light">
                      <EyeOff size={20} />
                    </Button>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem>Option 1</DropdownItem>
                        <DropdownItem>Option 2</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {showAddForm && (
          <AddProductForm onClose={() => setShowAddForm(false)} />
        )}

        {editingProduct && (
          <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} />
        )}
      </CardBody>
    </Card>
  );
}
