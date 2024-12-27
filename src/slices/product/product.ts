import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  image: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    filterProducts: (state, action: PayloadAction<{ category: string; status: string }>) => {
      const { category, status } = action.payload;
      state.filteredProducts = state.products.filter((product) => {
        const categoryMatch = category === 'all' || product.categoryName === category;
        const statusMatch = status === 'all' || 
          (status === 'available' && product.stock > 0) || 
          (status === 'hidden' && product.stock === 0);
        return categoryMatch && statusMatch;
      });
    },
  },
});

export const { setProducts, filterProducts } = productSlice.actions;
export default productSlice.reducer;

