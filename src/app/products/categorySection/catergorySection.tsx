import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Material-UI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import { addNewCategory, updateCategory, removeCategory } from "@/API/productAPI";

// Category Section Component
const CategorySection = ({ categories, setCategories }: { categories: any[], setCategories: any }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showActions, setShowActions] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false); // Track if a new category is being added
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setNewCategoryName(currentName);
    setShowActions(null); // Hide action menu when editing starts
  };

  const handleSave = async (index: number) => {
    let updatedCategories = [...categories];
    let category = updatedCategories[index];

    if (category.str_malh !== "") {
        try {
            await updateCategory(category.str_malh, newCategoryName);
        } catch (error) {
            console.error("Failed to update category", error);
        }
    } else {
        try {
            const response = await addNewCategory(newCategoryName);
            updatedCategories[index] = {
                ...category,
                str_malh: response.category.str_malh,
                str_tenlh: response.category.str_tenlh,
            };
            alert("Category added successfully");
        } catch (error) {
            console.error("Failed to add new category", error);
        }
    }

    setCategories(updatedCategories);
    setEditingIndex(null);
    setIsAdding(false); // Reset adding state after save
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setNewCategoryName("");
    setCategories(categories.filter((_, index) => index !== categories.length - 1)); // Remove the unsaved new category
  };

  const handleDelete = async (index: number, str_malh: string) => {
    try {
      await removeCategory(str_malh);
      alert("Delete Successful!!!");

      const updatedCategories = categories.filter((_, catIndex) => catIndex !== index);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleAddCategory = () => {
    const newCategory = {
      str_malh: "", // Unique ID
      str_tenlh: "",
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setEditingIndex(updatedCategories.length - 1);
    setNewCategoryName("");
    setIsAdding(true); // Set adding state to true
  };

  // Filtered categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.str_tenlh.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Categories List
        </h4>
      </div>

      <div className="mb-4 flex justify-between px-4">
        <input
          type="text"
          placeholder="Search by category name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mx-3 w-[500px] rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-5 flex items-center">
          <p className="font-medium">Category Name</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {filteredCategories.map((category, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
          <div className="col-span-5 flex items-center">
            {editingIndex === index ? (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none rounded-lg focus:border-primary dark:bg-form-input dark:text-white"
                autoFocus
                required
              />
            ) : (
              <p className="text-sm text-black dark:text-white">{category.str_tenlh}</p>
            )}
          </div>

          <div className="relative col-span-1 flex items-center">
            {editingIndex === index ? (
              <>
                <IconButton aria-label="save" onClick={() => handleSave(index)}>
                  <SaveIcon />
                </IconButton>
                {isAdding && (
                  <IconButton aria-label="cancel" onClick={handleCancelAdd}>
                    <CancelIcon />
                  </IconButton>
                )}
              </>
            ) : (
              <IconButton
                aria-label="actions"
                onClick={() => setShowActions(showActions === index ? null : index)}
              >
                <MoreVertIcon />
              </IconButton>
            )}

            {showActions === index && editingIndex !== index && (
              <div className="absolute right-0 top-10 z-10 rounded border bg-white p-2 shadow-md">
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(index, category.str_tenlh)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(index, category.str_malh)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleAddCategory}
          className="m-4 h-10 w-10 flex items-center justify-center rounded-full border border-meta-3 p-3 text-3xl font-extrabold text-meta-3 hover:bg-meta-3 hover:text-white"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CategorySection;
