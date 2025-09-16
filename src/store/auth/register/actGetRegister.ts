import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  cpassword: string;
  phoneNumber: string;
  classLevel: string;
}

interface SignUpResponse {
  message: string;
  success: boolean;
  data: {
    fullName: string;
    phoneNumber: string;
    classLevel: string;
    email: string;
    role: string;
    isVerified: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

const actSignUp = createAsyncThunk(
  "auth/actSignUp",
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      if (data.password !== data.cpassword) {
        return rejectWithValue("Passwords do not match");
      }

      const response = await api.post<SignUpResponse>("/auth/signup", data);

      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue(
            error.response.data.message || "Server error occurred"
          );
        } else if (error.request) {
          return rejectWithValue(
            "Network error - please check your connection"
          );
        }
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export default actSignUp;
