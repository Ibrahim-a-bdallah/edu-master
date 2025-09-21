import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
import axios from "axios";
import api from "@/lib/axios";

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

// تعديل createAsyncThunk لقبول token كمعامل
export const fetchLessons = createAsyncThunk<Lesson[], string>(
  "lessons/fetchLessons",
  async (token: string) => {
    try {
      const res = await api.get("/lesson/", {
        headers: {
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlicmFoaW1hYmRhbGw2OTFAZ21haWwuY29tIiwiX2lkIjoiNjhjZmUwZGI4NmQ2Mzg2ZjQzNGEzOTVjIiwiaWF0IjoxNzU4NDU1MTgxLCJleHAiOjE3NTg1NDE1ODF9.laqvnUAwGNwSnB_El3yLDzZ5eRoiL_RdxerFmprpY4o`,
        },
      });
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
