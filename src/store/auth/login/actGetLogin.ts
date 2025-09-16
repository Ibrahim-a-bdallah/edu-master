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
      const RLogin = await api.post("/auth/login", data);

      if (RLogin.data.success) {
        const token = RLogin.data.token;
        const response = await api.get("/user", {
          headers: {
            token: token,
          },
        });
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

export default actGetLogin;
