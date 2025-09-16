import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { RootState } from "@/store/store";

export interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  createdBy: string;
  classLevel: string;
  isPublished: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  questions: [];
}

interface ExamState {
  exams: Exam[];
  filteredExams: Exam[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  searchTerm: string;
  activeTab: "scheduled" | "history";
}

const initialState: ExamState = {
  exams: [],
  filteredExams: [],
  loading: "idle",
  error: null,
  searchTerm: "",
  activeTab: "scheduled",
};

// Async thunk to fetch exams
export const fetchExams = createAsyncThunk(
  "exams/fetchExams",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/exam", {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch exams"
      );
    }
  }
);

const examSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      // Filter exams based on search term
      if (!action.payload.trim()) {
        state.filteredExams = state.exams;
      } else {
        state.filteredExams = state.exams.filter(
          (exam) =>
            exam.title.toLowerCase().includes(action.payload.toLowerCase()) ||
            exam.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    setActiveTab: (state, action: PayloadAction<"scheduled" | "history">) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.exams = action.payload;
        state.filteredExams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setActiveTab, clearError } = examSlice.actions;

// Selectors
export const selectExams = (state: RootState) => state.examSlice.exams;
export const selectFilteredExams = (state: RootState) => state.examSlice.filteredExams;
export const selectLoading = (state: RootState) => state.examSlice.loading;
export const selectError = (state: RootState) => state.examSlice.error;
export const selectSearchTerm = (state: RootState) => state.examSlice.searchTerm;
export const selectActiveTab = (state: RootState) => state.examSlice.activeTab;

export default examSlice.reducer;