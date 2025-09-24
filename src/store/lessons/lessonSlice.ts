import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
import api from "@/lib/axios";

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  lastFetch: number; // إضافة timestamp للتحكم في التحديث
}

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
  lastFetch: 0,
};

// إضافة cache لمدة 5 دقائق
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

export const fetchLessons = createAsyncThunk<
  Lesson[],
  { token: string; title?: string; forceRefresh?: boolean }
>("lessons/fetchLessons", async ({ token, title, forceRefresh = false }) => {
  try {
    const params: any = {};
    if (title) params.title = title;

    const res = await api.get("/lesson/", {
      headers: { token: token || "" },
      params,
    });
    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
});

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessons: (state) => {
      state.lessons = [];
      state.lastFetch = 0;
    },
  },
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
          state.lastFetch = Date.now(); // تحديث وقت آخر جلب
        }
      )
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearLessons } = lessonSlice.actions;
export default lessonSlice.reducer;
