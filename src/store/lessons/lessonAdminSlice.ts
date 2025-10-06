import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Lesson,
  UpdateLessonData,
  LessonsResponse,
  CreateLessonData,
} from "@/lib/lessonService";
import api from "@/lib/axios";

// Create new lesson
export const actCreateLesson = createAsyncThunk(
  "lessons/actCreateLesson",
  async (
    { token, data }: { token: string; data: CreateLessonData },
    thunkAPI
  ) => {
    try {
      const response = await api.post("/lesson", data, {
        headers: {
          token: `${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return thunkAPI.rejectWithValue(
          "Authentication failed. Please login again."
        );
      }
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Get all lessons
export const actGetLessons = createAsyncThunk(
  "lessons/actGetLessons",
  async (token, thunkAPI) => {
    try {
      const response = await api.get("/lesson", {
        headers: {
          token: `${token}`,
        },
      });
      return response.data;
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
  async (
    { token, id, data }: { token: string; id: string; data: UpdateLessonData },
    thunkAPI
  ) => {
    try {
      const response = await api.put(`/lesson/${id}`, data, {
        headers: {
          token: `${token}`,
        },
      });
      return response.data;
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
  async ({ token, id }: { token: string; id: string }, thunkAPI) => {
    try {
      const response = await api.delete(`/lesson/${id}`, {
        headers: {
          token: `${token}`,
        },
      });
      return { ...response, id };
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
  createLoading: "idle" | "pending" | "succeeded" | "failed";
  createError: string | null;
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
  createLoading: "idle",
  createError: null,
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
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    resetCreateState: (state) => {
      state.createLoading = "idle";
      state.createError = null;
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
    // Create Lesson
    builder
      .addCase(actCreateLesson.pending, (state) => {
        state.createLoading = "pending";
        state.createError = null;
      })
      .addCase(actCreateLesson.fulfilled, (state, action) => {
        state.createLoading = "succeeded";
        // إضافة الـ lesson الجديد في بداية الـ array
        state.items.unshift(action.payload.data);
        // تحديث الـ pagination
        if (state.pagination) {
          state.pagination.total += 1;
        }
      })
      .addCase(actCreateLesson.rejected, (state, action) => {
        state.createLoading = "failed";
        state.createError =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to create lesson";
      })

      // Get Lessons
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
          state.error = null;
        }
      )
      .addCase(actGetLessons.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch lessons";
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
        state.updateError = null;
      })
      .addCase(actUpdateLesson.rejected, (state, action) => {
        state.updateLoading = "failed";
        state.updateError =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update lesson";
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
        state.deleteError = null;
      })
      .addCase(actDeleteLesson.rejected, (state, action) => {
        state.deleteLoading = "failed";
        state.deleteError =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to delete lesson";
      });
  },
});

export const {
  clearLessonsError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  resetCreateState,
  resetUpdateState,
  resetDeleteState,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
