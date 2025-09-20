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
  questions: any[];
}

interface ExamState {
  exams: Exam[];
  filteredExams: Exam[];
  currentExam: Exam | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  searchTerm: string;
  activeTab: "scheduled" | "history";
}

const initialState: ExamState = {
  exams: [],
  filteredExams: [],
  currentExam: null,
  loading: "idle",
  error: null,
  searchTerm: "",
  activeTab: "scheduled",
};

// ✅ Fetch all exams
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

// ✅ Get exam by ID
export const getExamById = createAsyncThunk(
  "exams/getExamById",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/exam/get/${id}`, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch exam"
      );
    }
  }
);

// ✅ Add new exam
export const addExam = createAsyncThunk(
  "exams/addExam",
  async (
    { examData, token }: { examData: Partial<Exam>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/exam", examData, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add exam"
      );
    }
  }
);

// ✅ Update exam
export const updateExam = createAsyncThunk(
  "exams/updateExam",
  async (
    {
      id,
      examData,
      token,
    }: { id: string; examData: Partial<Exam>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/exam/${id}`, examData, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update exam"
      );
    }
  }
);

// ✅ Delete exam
export const deleteExam = createAsyncThunk(
  "exams/deleteExam",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/exam/${id}`, {
        headers: { token },
      });
      return id; // return deleted exam ID
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete exam"
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
      if (!action.payload.trim()) {
        state.filteredExams = state.exams;
      } else {
        state.filteredExams = state.exams.filter(
          (exam) =>
            exam.title.toLowerCase().includes(action.payload.toLowerCase()) ||
            exam.description
              .toLowerCase()
              .includes(action.payload.toLowerCase())
        );
      }
    },
    setActiveTab: (state, action: PayloadAction<"scheduled" | "history">) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ أضفنا ده
    setCurrentExam: (state, action: PayloadAction<Exam | null>) => {
      state.currentExam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch exams
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
      })

      // get exam by id
      .addCase(getExamById.fulfilled, (state, action) => {
        state.currentExam = action.payload;
      })

      // add exam
      .addCase(addExam.fulfilled, (state, action) => {
        state.exams.push(action.payload);
        state.filteredExams.push(action.payload);
      })

      // update exam
      .addCase(updateExam.fulfilled, (state, action) => {
        const idx = state.exams.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) {
          state.exams[idx] = action.payload;
        }
        const fIdx = state.filteredExams.findIndex(
          (e) => e._id === action.payload._id
        );
        if (fIdx !== -1) {
          state.filteredExams[fIdx] = action.payload;
        }
      })

      // delete exam
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((exam) => exam._id !== action.payload);
        state.filteredExams = state.filteredExams.filter(
          (exam) => exam._id !== action.payload
        );
        if (state.currentExam?._id === action.payload) {
          state.currentExam = null;
        }
      });
  },
});

export const { setSearchTerm, setActiveTab, clearError, setCurrentExam } =
  examSlice.actions;

export const selectExams = (state: RootState) => state.examSlice.exams;
export const selectFilteredExams = (state: RootState) =>
  state.examSlice.filteredExams;
export const selectCurrentExam = (state: RootState) =>
  state.examSlice.currentExam;
export const selectLoading = (state: RootState) => state.examSlice.loading;
export const selectError = (state: RootState) => state.examSlice.error;
export const selectSearchTerm = (state: RootState) =>
  state.examSlice.searchTerm;
export const selectActiveTab = (state: RootState) => state.examSlice.activeTab;

export default examSlice.reducer;
