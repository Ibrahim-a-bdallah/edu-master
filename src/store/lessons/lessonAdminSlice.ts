import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "@/app/types/lesson";
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
export const fetchAdminLessons = createAsyncThunk<Lesson[], string>(
  "lessons/fetchAdminLessons",
  async (token: string) => {
    const res = await api.get("/lesson", {
      headers: { token },
      params: {
        classLevel: "Grade 1 Secondary",
        isPaid: true,
        sortBy: "scheduledDate",
        sortOrder: "asc",
      },
    });
    return res.data.data || [];
  }
);
const lessonAdminSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
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
        }
      )
      .addCase(fetchAdminLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default lessonAdminSlice.reducer;
