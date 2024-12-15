import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho sản phẩm

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    id: number;              // ID sản phẩm
    name: string;            // Tên sản phẩm
    description: string,
    price: number,
    stock: number,
    image: string,
    categoryName: string;    // Tên danh mục
    // Thêm các thuộc tính khác nếu cần
}
interface filterdAction{
    Products: Product[],
    filteredCategory: string,

}

interface ProductsState {
    products: Product[];         // Danh sách sản phẩm gốc
    filteredProducts: Product[]; // Danh sách sản phẩm đã lọc
    filteredCategory: string,
    message: string;             // Thông báo
}

const initialState: ProductsState = {
    products: [],
    filteredProducts: [],
    filteredCategory: "",
    message: ""
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<Product[]>) {
            state.products = action.payload;
            state.filteredProducts = action.payload; // Cập nhật cả sản phẩm gốc và sản phẩm đã lọc
        },
        setCategory(state, action: PayloadAction<string>) {
            state.filteredCategory = action.payload;
        },
        setFilteredProducts(state, action: PayloadAction<filterdAction>) {
            state.filteredCategory = action.payload.filteredCategory
            state.filteredProducts = action.payload.Products; // Cập nhật sản phẩm đã lọc
        },
        setMessage(state, action: PayloadAction<string>) {
            state.message = action.payload; // Cập nhật thông báo
        },
        
        createProduct(state, action: PayloadAction<Product>) {
            state.products.push(action.payload);
            if (action.payload.categoryName == state.filteredCategory)
                state.filteredProducts.push(action.payload); // Đồng bộ danh sách lọc
            state.message = "Product created successfully!";
        },

        // 3. Cập nhật sản phẩm theo ID
        updateProductById(state, action: PayloadAction<Product>) {
            const updatedProduct = action.payload;
            const index = state.products.findIndex(product => product.id === updatedProduct.id);

            if (index !== -1) {
                // Cập nhật sản phẩm trong danh sách gốc
                state.products[index] = { ...state.products[index], ...updatedProduct };

                if (action.payload.categoryName == state.filteredCategory){

                    const filteredIndex = state.filteredProducts.findIndex(product => product.id === updatedProduct.id);
                    if (filteredIndex !== -1) {
                        state.filteredProducts[filteredIndex] = { ...state.filteredProducts[filteredIndex], ...updatedProduct };
                    }
                }
                state.message = "Product updated successfully!";
            } else {
                state.message = "Product not found!";
            }
        },

        // 4. Xóa sản phẩm theo ID
        deleteProductById(state, action: PayloadAction<number>) {
            const id = action.payload;

            // Xóa sản phẩm trong danh sách gốc
            state.products = state.products.filter(product => product.id !== id);

            // Đồng bộ danh sách lọc
            state.filteredProducts = state.filteredProducts.filter(product => product.id !== id);

            state.message = `Product with ID ${id} deleted successfully!`;
        }
    },
});

export const { setProducts, setFilteredProducts, setMessage, updateProductById, setCategory} = productsSlice.actions;
export default productsSlice.reducer;
