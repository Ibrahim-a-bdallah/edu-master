"use client";
import { useEffect, useState } from "react";
import { fetchLessons } from "@/store/lessons/lessonSlice";
import LessonCard from "@/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";

const LessonsClient = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector((state) => state.lessons); // Access lessons state
  const { token } = useAppSelector((state) => state.auth); // Access lessons state
  const[search , setSearch]=useState("")
  useEffect(() => {
    dispatch(fetchLessons({token}));
  }, [dispatch , token]);
  const handleSearch = () => {
    if (token) {
      dispatch(fetchLessons({ token, title: search })); // Pass both token and title to the thunk
    }
  };
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
          onChange={(e) => setSearch(e.target.value)}  //update search state on input change
          className="flex-1  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white rounded-lg bg-purple-600 hover:bg-purple-700 cursor-pointer"
        >
          Search
        </button>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessons.length > 0 &&
          lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
      </div>
    </div>
  );
};
export default LessonsClient;
