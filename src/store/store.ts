import { configureStore } from "@reduxjs/toolkit";
import authLoginSlice from "./auth/login/loginSlice";
import signUpReducer from "./auth/register/registerSlice";
import examReducer from "./teachers/exams/examSlice";
import lessonSlice from "./lessons/lessonSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      authLoginSlice: authLoginSlice,
      examSlice: examReducer,
      authSignUp: signUpReducer,
      lessons: lessonSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
