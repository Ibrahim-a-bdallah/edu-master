// store/auth/login/actGetLogin.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  role: string;
  token: string;
}

interface LoginError {
  error: string;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const responseData = error.response.data as any;
      return (
        responseData?.error ||
        responseData?.message ||
        error.message ||
        `Server error: ${error.response.status}`
      );
    }

    if (error.request) {
      return "No response from server - network error";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
};

const actGetLogin = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: LoginError }
>("auth/actGetLogin", async (data, thunkAPI) => {
  try {
    const response = await axios.post<LoginResponse>("api/auth/login", data);

    if (!response.data.role || !response.data.token) {
      return thunkAPI.rejectWithValue({
        error: "Invalid response from server",
      });
    }

    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return thunkAPI.rejectWithValue({ error: errorMessage });
  }
});

export default actGetLogin;
