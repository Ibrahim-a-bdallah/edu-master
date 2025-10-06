import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLessons,
  updateLesson,
  deleteLesson,
  Lesson,
  UpdateLessonData,
  LessonsResponse,
} from "@/lib/lessonService";

// Get all lessons
export const actGetLessons = createAsyncThunk(
  "lessons/actGetLessons",
  async (_, thunkAPI) => {
    try {
      const response = await getLessons();
      return response;
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue({ message: "An unknown error occurred" });
    }
  }
);

// Update lesson
export const actUpdateLesson = createAsyncThunk(
  "lessons/actUpdateLesson",
  async ({ id, data }: { id: string; data: UpdateLessonData }, thunkAPI) => {
    try {
      const response = await updateLesson(id, data);
      return response;
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue({ message: "An unknown error occurred" });
    }
  }
);

// Delete lesson
export const actDeleteLesson = createAsyncThunk(
  "lessons/actDeleteLesson",
  async (id: string, thunkAPI) => {
    try {
      const response = await deleteLesson(id);
      return { ...response, id }; // إرجاع الـ id مع الاستجابة للحذف
    } catch (error: any) {
      if (error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue({ message: "An unknown error occurred" });
    }
  }
);

interface LessonsState {
  items: Lesson[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  } | null;
  updateLoading: "idle" | "pending" | "succeeded" | "failed";
  updateError: string | null;
  deleteLoading: "idle" | "pending" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: LessonsState = {
  items: [],
  loading: "idle",
  error: null,
  pagination: null,
  updateLoading: "idle",
  updateError: null,
  deleteLoading: "idle",
  deleteError: null,
};

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessonsError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    resetUpdateState: (state) => {
      state.updateLoading = "idle";
      state.updateError = null;
    },
    resetDeleteState: (state) => {
      state.deleteLoading = "idle";
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    // Get Lessons
    builder
      .addCase(actGetLessons.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        actGetLessons.fulfilled,
        (state, action: PayloadAction<LessonsResponse>) => {
          state.loading = "succeeded";
          state.items = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(actGetLessons.rejected, (state, action) => {
        state.loading = "failed";
        state.error = (action.payload as string) || "Failed to fetch lessons";
      })

      // Update Lesson
      .addCase(actUpdateLesson.pending, (state) => {
        state.updateLoading = "pending";
        state.updateError = null;
      })
      .addCase(actUpdateLesson.fulfilled, (state, action) => {
        state.updateLoading = "succeeded";
        // تحديث الـ lesson في الـ state
        const updatedLesson = action.payload.data;
        const index = state.items.findIndex(
          (lesson) => lesson._id === updatedLesson._id
        );
        if (index !== -1) {
          state.items[index] = updatedLesson;
        }
      })
      .addCase(actUpdateLesson.rejected, (state, action) => {
        state.updateLoading = "failed";
        state.updateError =
          (action.payload as string) || "Failed to update lesson";
      })

      // Delete Lesson
      .addCase(actDeleteLesson.pending, (state) => {
        state.deleteLoading = "pending";
        state.deleteError = null;
      })
      .addCase(actDeleteLesson.fulfilled, (state, action) => {
        state.deleteLoading = "succeeded";
        // إزالة الـ lesson من الـ state
        const deletedId = action.payload.id;
        state.items = state.items.filter((lesson) => lesson._id !== deletedId);

        // تحديث الـ pagination
        if (state.pagination) {
          state.pagination.total -= 1;
        }
      })
      .addCase(actDeleteLesson.rejected, (state, action) => {
        state.deleteLoading = "failed";
        state.deleteError =
          (action.payload as string) || "Failed to delete lesson";
      });
  },
});

export const {
  clearLessonsError,
  clearUpdateError,
  clearDeleteError,
  resetUpdateState,
  resetDeleteState,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
