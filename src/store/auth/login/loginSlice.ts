import { createSlice } from "@reduxjs/toolkit";
import actGetLogin from "./actGetLogin";
interface LoginState {
  Loading: "idle" | "pending" | "succeeded" | "failed";
  errorMessage: string | null;
  userData: any | null;
}
const initialState: LoginState = {
  Loading: "idle",
  errorMessage: null,
  userData: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actGetLogin.pending, (state) => {
      state.Loading = "pending";
      state.errorMessage = null;
    });
    builder.addCase(actGetLogin.fulfilled, (state, action) => {
      state.Loading = "succeeded";
      state.userData = action.payload.data;
    });
    builder.addCase(actGetLogin.rejected, (state, action) => {
      state.Loading = "failed";
      state.errorMessage = action.payload as string;
    });
  },
});

export default loginSlice.reducer;
