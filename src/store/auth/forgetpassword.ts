import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/forgot-password", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send verification code"
      );
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (credentials: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      // This would typically be part of the reset password flow
      // For now, we'll just verify the OP
      const response = await api.post("/user/reset-password", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid verification code"
      );
    }
  }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    credentials: {
      email: string;
      otp: string;
      newPassword: string;
      cpassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user/reset-password", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
