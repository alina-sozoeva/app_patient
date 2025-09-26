import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

export const userSlices = createSlice({
  name: "userSlices",
  initialState,
  reducers: {
    addUser: (state, actions) => {
      state.user = actions.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { addUser, removeUser } = userSlices.actions;

export default userSlices.reducer;
