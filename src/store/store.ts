// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { encryptTransform } from "./encryptTransform";
import { combineReducers } from "redux";
import authLoginSlice from "./auth/login/loginSlice";
import authSlice from "./auth/forgetpassword";
import examReducer from "./teachers/exams/examSlice";
import signUpReducer from "./auth/register/registerSlice";
import lessonSlice from "./lessons/lessonSlice";

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptTransform],
  whitelist: ["auth"], // هنا بتحدد أي Slice يتخزن
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authLoginSlice,
  forgetpassword: authSlice,
  examSlice: examReducer,
  authSignUp: signUpReducer,
  lessons: lessonSlice,
});

// حل مشكلة الـ typing هنا
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // عشان redux-persist
    }),
});

export const persistor = persistStore(store);

// النوعين بتوع الـ state و الـ dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
