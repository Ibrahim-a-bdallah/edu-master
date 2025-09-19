"use client";
import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/store";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { RootState } from "@/store/store";
//const { token } = useAppSelector((state) => state.authLoginSlice); // Access lessons state
  // const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);
import { useEffect } from "react";
import { fetchLessons } from "@/store/lessons/lessonSlice";
import LessonCard from "@/app/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
const LessonsClient = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector((state) => state.lessons); // Access lessons state
  const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vdXJoYW50YWhhNTg4QGdtYWlsLmNvbSIsIl9pZCI6IjY4YzgzMmRiZWZhYTE4OWQwMDM5MDBhNSIsImlhdCI6MTc1ODI4NjI4NSwiZXhwIjoxNzU4MzcyNjg1fQ.dYh3J9Gdm64E8_aC0yTxPP4pZC9zsbX0qyK_SVMaQ88";
  useEffect(() => {
    dispatch(fetchLessons(token));
  }, [dispatch]);

  if (loading) return <p className="text-center py-8">Loading lessons...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Lessons
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};
export default LessonsClient;
