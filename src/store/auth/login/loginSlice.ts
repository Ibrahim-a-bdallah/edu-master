import { createSlice } from "@reduxjs/toolkit";
import actGetLogin from "./actGetLogin";

interface LoginState {
  Loading: "idle" | "pending" | "succeeded" | "failed";
  errorMessage: string | null;
  userData: { token: string; user: any } | null;
}

const initialState: LoginState = {
  Loading: "idle",
  errorMessage: null,
  userData: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    hydrateUser: (state) => {
      if (typeof window !== "undefined") {
        const savedData = localStorage.getItem("userData");
        if (savedData) {
          state.userData = JSON.parse(savedData);
        }
      }
    },
    logout: (state) => {
      state.userData = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userData");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetLogin.pending, (state) => {
      state.Loading = "pending";
      state.errorMessage = null;
    });
    builder.addCase(actGetLogin.fulfilled, (state, action) => {
      state.Loading = "succeeded";
      state.userData = action.payload ? action.payload : null;

      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      }
    });
    builder.addCase(actGetLogin.rejected, (state, action) => {
      state.Loading = "failed";
      state.errorMessage = action.payload as string;
    });
  },
});

export const { hydrateUser, logout } = loginSlice.actions;
export default loginSlice.reducer;
