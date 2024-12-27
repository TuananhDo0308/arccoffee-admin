import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu cho mỗi category
interface Category {
    id: string;   // ID của category (UUID hoặc string)
    name: string; // Tên của category
}

// Định nghĩa state cho category
interface CategoryState {
    categories: Category[];  // Mảng lưu trữ các category
    loading: boolean;        // Trạng thái loading
    error: string | null;    // Thông báo lỗi
}

// State ban đầu
const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

// Tạo slice cho category
const categorySlice = createSlice({
    name: 'category',  // Tên slice
    initialState,      // State ban đầu
    reducers: {
        // Thêm category mới
        addCategory(state, action: PayloadAction<Category>) {
            state.categories.push(action.payload);
        },

        // Cập nhật tên category dựa trên id
        updateCategoryName(state, action: PayloadAction<{ id: string, name: string }>) {
            const { id, name } = action.payload;
            const category = state.categories.find(c => c.id === id);
            if (category) {
                category.name = name;
            }
        },

        // Xóa category theo id
        deleteCategory(state, action: PayloadAction<string>) {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },

        // Set trạng thái loading
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        // Set lỗi
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        // Cập nhật tất cả categories (ví dụ từ API)
        setCategories(state, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
    },
});

// Export actions từ slice
export const {
    addCategory,
    updateCategoryName,
    deleteCategory,
    setLoading,
    setError,
    setCategories,
} = categorySlice.actions;

// Export reducer để sử dụng trong store
export default categorySlice.reducer;
