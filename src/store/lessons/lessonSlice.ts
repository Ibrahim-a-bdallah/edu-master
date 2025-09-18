import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
import axios from "axios";

interface LessonState { // Define the state structure
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}
const initialState: LessonState = { // Initial state
  lessons: [],
  loading: false,
  error: null,
};
export const fetchLessons = createAsyncThunk<Lesson[]>( // async thunk for fetching lessons
  "lessons/fetchLessons",
  async () => {
    try {
      const res = await axios.get("https://edu-master-delta.vercel.app/lesson", {
      headers: {
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vdXJoYW50YWhhNTg4QGdtYWlsLmNvbSIsIl9pZCI6IjY4YzgzMmRiZWZhYTE4OWQwMDM5MDBhNSIsImlhdCI6MTc1ODIwMTE4MywiZXhwIjoxNzU4Mjg3NTgzfQ.KJk9_hHuX7X1tObWqCdKe_HJvxDw2mhbH_SuL1tOcOo", 
      }
      });
      return res.data.data || [];
    } catch (error: any) {
      throw new Error(error.message || "Network error");
    }
  }
);

const lessonSlice = createSlice({ // createSlice
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => { // when the fetch starts
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action: PayloadAction<Lesson[]>) => { // when the fetch is successful
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => { // when the fetch fails
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default lessonSlice.reducer;

