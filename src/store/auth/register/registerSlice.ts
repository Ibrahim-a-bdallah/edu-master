import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import actSignUp from "./actGetRegister";

interface UserData {
  fullName: string;
  phoneNumber: string;
  classLevel: string;
  email: string;
  role: string;
  isVerified: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface SignUpState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  errorMessage: string | null;
  userData: UserData | null;
  successMessage: string | null;
}

const initialState: SignUpState = {
  loading: "idle",
  errorMessage: null,
  userData: null,
  successMessage: null,
};

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    resetState: () => initialState,
    clearError: (state) => {
      state.errorMessage = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actSignUp.pending, (state) => {
        state.loading = "pending";
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(actSignUp.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userData = action.payload.data;
        state.successMessage = action.payload.message;
        state.errorMessage = null;
      })
      .addCase(actSignUp.rejected, (state, action) => {
        state.loading = "failed";
        state.errorMessage = action.payload as string;
        state.successMessage = null;
        state.userData = null;
      });
  },
});

export const { resetState, clearError, clearSuccess } = signUpSlice.actions;
export default signUpSlice.reducer;
