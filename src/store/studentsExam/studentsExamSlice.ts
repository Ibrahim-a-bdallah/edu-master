import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { RootState } from "..";

interface StudentExamState {
  submittedExams: any[]; // Consider defining a specific type instead of 'any'
  remainingTime: string | null;
  scoreExam: string | null; // Fixed typo
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  activeTab: "scheduled" | "history";
}

const initialState: StudentExamState = {
  submittedExams: [],
  remainingTime: null,
  scoreExam: null, // Fixed typo
  loading: "idle",
  error: null,
  activeTab: "scheduled",
};

// Fetch students score
export const fetchScoreExam = createAsyncThunk(
  "studentsExams/fetchScoreExam",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/studentExam/exams/score/${id}`, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch score exam"
      );
    }
  }
);

// Get remaining time
export const getRemainingTime = createAsyncThunk(
  "studentsExams/getRemainingTime",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/studentExam/exams/remaining-time/${id}`,
        {
          headers: { token },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch remaining exam time"
      );
    }
  }
);

// Submit exam
export const submitExams = createAsyncThunk(
  "studentsExams/submitExam",
  async (
    {
      studentExamData,
      token,
    }: { studentExamData: Partial<any>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/studentExam/submit`, studentExamData, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit exam"
      );
    }
  }
);

// Start exam
export const startExam = createAsyncThunk(
  "studentsExams/startExam",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/studentExam/start/${id}`,
        {},
        {
          headers: {
            token: token || "",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start exam"
      );
    }
  }
);

const studentExamSlice = createSlice({
  name: "studentsExams",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<"scheduled" | "history">) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch score exam
      .addCase(fetchScoreExam.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchScoreExam.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.scoreExam = action.payload; // Fixed typo
      })
      .addCase(fetchScoreExam.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Get remaining time
      .addCase(getRemainingTime.fulfilled, (state, action) => {
        state.remainingTime = action.payload;
      })
      // Submit exam
      .addCase(submitExams.fulfilled, (state, action) => {
        state.submittedExams.push(action.payload);
      });
  },
});

export const { setActiveTab, clearError } = studentExamSlice.actions;

export const selectScoreExams = (state: RootState) =>
  state.studentExamSlice.scoreExam; // Fixed typo
export const selectRemainingTime = (state: RootState) =>
  state.studentExamSlice.remainingTime;
// export const selectLoading = (state: RootState) =>
//   state.studentExamSlice.loading;
export const selectError = (state: RootState) => state.studentExamSlice.error;
export const selectActiveTab = (state: RootState) =>
  state.studentExamSlice.activeTab;

export default studentExamSlice.reducer;
