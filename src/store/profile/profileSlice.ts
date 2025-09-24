import { createSlice } from "@reduxjs/toolkit";
import actgetProfile from "./actgetProfile";

interface ProfileState {
  UserData: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  loading: "idel" | "pending" | "succeeded" | "failed";
  error: string | null;
}
const initialState: ProfileState = {
  UserData: null,
  loading: "idel",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actgetProfile.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actgetProfile.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.UserData = action.payload;
      state.error = null;
    });
    builder.addCase(actgetProfile.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
      state.UserData = null;
    });
  },
});

export default profileSlice.reducer;
