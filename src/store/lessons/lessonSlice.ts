import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
import axios from "axios";

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}
const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
};
export const fetchLessons = createAsyncThunk<Lesson[], string>(
  "lessons/fetchLessons",
  async (token: string) => {
    try {

      const res = await axios.get(
        "https://edu-master-delta.vercel.app/lesson",
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      return res.data.data || [];
    } catch (error: any) {
      throw new Error(error.message || "Network error");
    }
  }
);
const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLessons.fulfilled,
        (state, action: PayloadAction<Lesson[]>) => {
          state.loading = false;
          state.lessons = action.payload;
        }
      )
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default lessonSlice.reducer;
