// lib/store/examSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// Async Thunks
export const fetchExamDetails = createAsyncThunk(
  "exam/fetchExamDetails",
  async (
    { token, examId }: { token: string; examId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`/exam/get/${examId}`, {
        headers: {
          token: token,
        },
      });
      if (response.data.success) {
        console.log(response.data);
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startExamAttempt = createAsyncThunk(
  "exam/startExamAttempt",
  async (
    { token, examId }: { token: string; examId: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("start api");
      const response = await api.post(
        `/studentExam/start/${examId}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.success) {
        // console.log("API Response:", response.data);
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitExamAttempt = createAsyncThunk(
  "exam/submitExamAttempt",
  async (
    {
      token,
      examId,
      answers,
    }: {
      token: string;
      examId: string;
      answers: Array<{ questionId: string; selectedAnswer: string }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/studentExam/submit/${examId}`,
        {
          answers,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRemainingTime = createAsyncThunk(
  "exam/fetchRemainingTime",
  async (
    { token, examId }: { token: string; examId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/studentExam/exams/remaining-time/${examId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScoreExam = createAsyncThunk(
  "exam/fetchScoreExam",
  async (
    { token, examId }: { token: string; examId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`/studentExam/exams/score/${examId}`, {
        headers: {
          token: token,
        },
      });
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ExamState {
  currentExam: {
    examId: string;
    startTime: string;
    endTime: string;
    questions: string[];
    examDetails: any;
  } | null;
  answers: { [questionId: string]: string };
  loading: boolean;
  error: string | null;
  time: {
    message: string;
    remainingTime: { minutes: number; seconds: number };
  } | null;
  submitResult: {
    message: string;
    success: boolean;
    data: {
      id: string;
      score: number;
    };
  } | null;
}

const initialState: ExamState = {
  currentExam: null,
  answers: {},
  loading: false,
  error: null,
  time: null,
  submitResult: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    submitAnswer: (
      state,
      action: PayloadAction<{
        questionId: string;
        selectedAnswer: string;
      }>
    ) => {
      state.answers[action.payload.questionId] = action.payload.selectedAnswer;
    },

    endExam: (state) => {
      state.currentExam = null;
      state.answers = {};
      state.submitResult = null;
      state.time = null;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Exam Details
      .addCase(fetchExamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Note: We don't set currentExam here, just get details for preview
        state.currentExam = action.payload.data;
      })
      .addCase(fetchExamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Start Exam Attempt
      .addCase(startExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExamAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Here we set the current exam with start data
        state.currentExam = {
          examId: action.payload.exam._id,
          startTime: action.payload.startTime,
          endTime: action.payload.endTime,
          questions: action.payload.exam.questions,
          examDetails: null, // Will be set separately
        };
      })
      .addCase(startExamAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Submit Exam Attempt
      .addCase(submitExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExamAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.submitResult = action.payload;
        // Clear exam data after submission
        state.currentExam = null;
        state.answers = {};
      })
      .addCase(submitExamAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Remaining Time
      .addCase(fetchRemainingTime.pending, (state, action) => {
        state.time = null;
      })
      .addCase(fetchRemainingTime.fulfilled, (state, action) => {
        state.time = action.payload;
      })

      .addCase(fetchScoreExam.pending, (state, action) => {
        state.submitResult = null;
      })
      .addCase(fetchScoreExam.fulfilled, (state, action) => {
        state.submitResult = action.payload;
      });
  },
});

export const { submitAnswer, endExam, setError } = examSlice.actions;
export default examSlice.reducer;
