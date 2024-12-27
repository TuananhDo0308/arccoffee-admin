import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null, // Mặc định token là null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Lưu token vào state
    },
    removeToken: (state) => {
      state.token = null; // Xoá token khi người dùng đăng xuất
    },
  },
});

export const { setToken, removeToken } = userSlice.actions;

export default userSlice.reducer;
