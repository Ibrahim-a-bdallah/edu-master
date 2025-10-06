import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const actgetProfile = createAsyncThunk(
  "profile/actgetProfile",
  async (token: string, thunkAPI) => {
    try {
      const response = await api.get("/user", {
        headers: {
          token: `${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export default actgetProfile;
