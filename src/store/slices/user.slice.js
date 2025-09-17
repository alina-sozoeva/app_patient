import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId"),
};

export const userSlices = createSlice({
  name: "userSlices",
  initialState,
  reducers: {
    addUserId: (state, actions) => {
      state.userId = actions.payload;
      localStorage.setItem("userId", state.userId);
    },
    removeUserId: (state) => {
      state.userId = null;
      localStorage.removeItem("userId");
    },
  },
});

export const { addUserId, removeUserId } = userSlices.actions;

export default userSlices.reducer;
