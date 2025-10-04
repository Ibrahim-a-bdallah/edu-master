// store/auth/login/actGetLogin.ts
import api from "@/lib/axios";
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

const actGetLogin = createAsyncThunk<
  LoginResponse,
  LoginData,
  { rejectValue: LoginError }
>("auth/actGetLogin", async (data, thunkAPI) => {
  try {
    const RLogin = await api.post("/auth/login", data);

    return {
      role: RLogin.data.role,
      token: RLogin.data.token,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue({ error: error.response.data.error });
    }
    return thunkAPI.rejectWithValue({ error: "An unknown error occurred" });
  }
});

export default actGetLogin;
