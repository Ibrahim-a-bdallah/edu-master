// store/auth/login/actGetLogin.ts
import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

const actGetLogin = createAsyncThunk(
  "auth/actGetLogin",
  async (data: LoginData, thunkAPI) => {
    try {
      const RLogin = await axios.post("/api/auth/login", data);

      return {
        role: RLogin.data.role,
        token: RLogin.data.token,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.error);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

export default actGetLogin;
