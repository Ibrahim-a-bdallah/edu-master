import { createSlice } from "@reduxjs/toolkit";
import actGetLogin from "./actGetLogin";

interface LoginState {
  Loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  token?: string | null;
  role?: string | null;
}

const initialState: LoginState = {
  Loading: "idle",
  error: null,
  token: null,
  role: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.role = null;
      state.token = null;
      state.error = null;
      state.Loading = "idle";
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetLogin.pending, (state) => {
      state.Loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetLogin.fulfilled, (state, action) => {
      state.Loading = "succeeded";
      if (action.payload) {
        state.role = action.payload.role;
        state.token = action.payload.token;
      } else {
        state.role = null;
        state.token = null;
      }
    });
    builder.addCase(actGetLogin.rejected, (state, action) => {
      state.Loading = "failed";
      if (action.payload) {
        state.error = action.payload.error;
      }
    });
  },
});

export const { logout, resetError } = loginSlice.actions;
export default loginSlice.reducer;
