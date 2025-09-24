import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
import api from "@/lib/axios";

interface LessonState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  searchTerm: string;
}

const initialState: LessonState = {
  lessons: [],
  loading: false,
  error: null,
  lastFetch: 0,
  searchTerm: "",
};

// cache لمدة 10 دقائق للبيانات الإدارية
const CACHE_DURATION = 10 * 60 * 1000;
// إضافة pagination للـ admin slice
export const fetchAdminLessonsPaginated = createAsyncThunk<
  { lessons: Lesson[]; total: number; page: number; hasMore: boolean },
  { token: string; page: number; limit: number; title?: string }
>(
  "lessonsAdmin/fetchAdminLessonsPaginated",
  async ({ token, page, limit, title }) => {
    const params: any = {
      classLevel: "Grade 1 Secondary",
      isPaid: true,
      sortBy: "scheduledDate",
      sortOrder: "asc",
      page,
      limit,
    };

    if (title) {
      params.title = title;
    }

    const res = await api.get("/lesson", {
      headers: { token },
      params,
    });

    return {
      lessons: res.data.data || [],
      total: res.data.total || 0,
      page: res.data.page || 1,
      hasMore: res.data.hasMore || false,
    };
  }
);
export const fetchAdminLessons = createAsyncThunk<
  Lesson[],
  { token: string; title?: string; forceRefresh?: boolean }
>(
  "lessonsAdmin/fetchAdminLessons",
  async ({ token, title, forceRefresh = false }) => {
    const params: any = {
      classLevel: "Grade 1 Secondary",
      isPaid: true,
      sortBy: "scheduledDate",
      sortOrder: "asc",
    };

    if (title) {
      params.title = title;
    }

    const res = await api.get("/lesson", {
      headers: { token },
      params,
    });

    return res.data.data || [];
  }
);

const lessonAdminSlice = createSlice({
  name: "lessonsAdmin",
  initialState,
  reducers: {
    clearAdminLessons: (state) => {
      state.lessons = [];
      state.lastFetch = 0;
      state.searchTerm = "";
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    // إضافة دالة لحذف درس محدد
    removeLesson: (state, action: PayloadAction<string>) => {
      state.lessons = state.lessons.filter(
        (lesson) => lesson._id !== action.payload
      );
    },
    // إضافة دالة لتحديث درس
    updateLesson: (state, action: PayloadAction<Lesson>) => {
      const index = state.lessons.findIndex(
        (lesson) => lesson._id === action.payload._id
      );
      if (index !== -1) {
        state.lessons[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminLessons.fulfilled,
        (state, action: PayloadAction<Lesson[]>) => {
          state.loading = false;
          state.lessons = action.payload;
          state.lastFetch = Date.now();
          state.error = null;
        }
      )
      .addCase(fetchAdminLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearAdminLessons, setSearchTerm, removeLesson, updateLesson } =
  lessonAdminSlice.actions;

export default lessonAdminSlice.reducer;
