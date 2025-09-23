"use client";
import { useEffect, useState } from "react";
import { fetchLessons } from "@/store/lessons/lessonSlice";
import LessonCard from "@/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { Lesson } from "@/app/types/lesson";

const LessonsClient = () => {
  const dispatch = useAppDispatch();

  const { lessons, loading, error } = useAppSelector((state) => state.lessons); // Access lessons state
  const { token } = useAppSelector((state) => state.auth); // Access lessons state
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLessons({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) return;
    const handleSearch = setTimeout(() => {
      if (search.trim().length > 0) {
        dispatch(fetchLessons({ token, title: search }));
      } else {
        dispatch(fetchLessons({ token }));
      }
    }, 1000); // debounce time of 1 second because prevent too many requests
    return () => clearTimeout(handleSearch);
  }, [dispatch, token, search]);

  if (loading) return <p className="text-center py-8">Loading lessons...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Lessons
      </h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)} //update search state on input change
          className="flex-1  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="grid gap-8 justify-center items-center  lg:grid-cols-2 xl:grid-cols-3">
        {lessons.length > 0
          ? lessons.map((lesson: Lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))
          : search.trim().length > 0 && (
              <p className="text-center text-gray-500 col-span-full">
                No lessons found for "{search}"
              </p>
            )}
      </div>
    </div>
  );
};
export default LessonsClient;
