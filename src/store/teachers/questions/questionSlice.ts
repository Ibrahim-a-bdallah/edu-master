// store/teachers/questions/questionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { RootState } from "@/store/store";
import { Question, QuestionState } from "@/app/types/questions";

const initialState: QuestionState = {
  questions: [],
  filteredQuestions: [],
  currentQuestion: null,
  loading: "idle",
  error: null,
  searchTerm: "",
  filterByExam: null,
};

// ✅ Fetch all questions
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/question", {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch questions"
      );
    }
  }
);

// ✅ Get question by ID
export const getQuestionById = createAsyncThunk(
  "questions/getQuestionById",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/question/get/${id}`, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch question"
      );
    }
  }
);

// ✅ Add new question
export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async (
    { questionData, token }: { questionData: Partial<Question>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/question", questionData, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add question"
      );
    }
  }
);

// ✅ Update question
export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async (
    {
      id,
      questionData,
      token,
    }: { id: string; questionData: Partial<Question>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/question/${id}`, questionData, {
        headers: { token },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update question"
      );
    }
  }
);

// ✅ Delete question
export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/question/${id}`, {
        headers: { token },
      });
      return id; // return deleted question ID
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      applyFilters(state);
    },
    setFilterByExam: (state, action: PayloadAction<string | null>) => {
      state.filterByExam = action.payload;
      applyFilters(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
      state.currentQuestion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.questions = action.payload;
        applyFilters(state);
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // get question by id
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.currentQuestion = action.payload;
      })

      // add question
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        applyFilters(state);
      })

      // update question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.questions.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) {
          state.questions[idx] = action.payload;
        }
        applyFilters(state);
        
        if (state.currentQuestion?._id === action.payload._id) {
          state.currentQuestion = action.payload;
        }
      })

      // delete question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((question) => question._id !== action.payload);
        applyFilters(state);
        
        if (state.currentQuestion?._id === action.payload) {
          state.currentQuestion = null;
        }
      });
  },
});

// Helper function to apply filters
const applyFilters = (state: QuestionState) => {
  let filtered = state.questions;
  
  // Apply search filter
  if (state.searchTerm) {
    filtered = filtered.filter(
      (question) =>
        question.text.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }
  
  // Apply exam filter
  if (state.filterByExam) {
    filtered = filtered.filter(
      (question) => question.exam === state.filterByExam
    );
  }
  
  state.filteredQuestions = filtered;
};

export const { setSearchTerm, setFilterByExam, clearError, setCurrentQuestion } =
  questionSlice.actions;

export const selectQuestions = (state: RootState) => state.questions.questions;
export const selectFilteredQuestions = (state: RootState) =>
  state.questions.filteredQuestions;
export const selectCurrentQuestion = (state: RootState) =>
  state.questions.currentQuestion;
export const selectLoading = (state: RootState) => state.questions.loading;
export const selectError = (state: RootState) => state.questions.error;
export const selectSearchTerm = (state: RootState) =>
  state.questions.searchTerm;
export const selectFilterByExam = (state: RootState) =>
  state.questions.filterByExam;

export default questionSlice.reducer;