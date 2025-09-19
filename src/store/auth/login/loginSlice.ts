import { createSlice } from "@reduxjs/toolkit";
import actGetLogin from "./actGetLogin";

interface LoginState {
  Loading: "idle" | "pending" | "succeeded" | "failed";
  errorMessage: string | null;
  userData: any;
  tokan?: string | null;
}

const initialState: LoginState = {
  Loading: "idle",
  errorMessage: null,
  userData: null,
  tokan: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.tokan = null;
      state.errorMessage = null;
      state.Loading = "idle";
    },
    resetError: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetLogin.pending, (state) => {
      state.Loading = "pending";
      state.errorMessage = null;
    });
    builder.addCase(actGetLogin.fulfilled, (state, action) => {
      state.Loading = "succeeded";
      if (action.payload) {
        state.userData = action.payload.user;
        state.tokan = action.payload.token;
      } else {
        state.userData = null;
        state.tokan = null;
      }
    });
    builder.addCase(actGetLogin.rejected, (state, action) => {
      state.Loading = "failed";
      state.errorMessage = action.payload as string;
    });
  },
});

export const { logout, resetError } = loginSlice.actions;
export default loginSlice.reducer;
