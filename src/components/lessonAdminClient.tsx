"use client";
import { useEffect, useState } from "react";
import { fetchAdminLessons } from "@/store/lessons/lessonAdminSlice";
import LessonCard from "@/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { Lesson } from "@/app/types/lesson";

const LessonsAdminClient = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector(
    (state) => state.lessonsAdmin
  ); // Access lessons state
  const { token } = useAppSelector((state) => state.auth); // Access lessons state
  const [search, setSearch] = useState("");
  const [allLessons, setAllLessons] = useState<typeof lessons>([]);

  useEffect(() => {
    const loadLessons = async () => {
      if (!token) return;
      const res: any = await dispatch(fetchAdminLessons(token));
      setAllLessons(res.payload); 
    };
    loadLessons();
  }, [dispatch, token]);
  const filteredLessons = allLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center py-8">Loading lessons...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Lessons Admin
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}  //update search state on input change
          className="flex-1  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.length > 0 ?
          (filteredLessons.map((lesson) => (

            <LessonCard key={lesson._id} lesson={lesson} />
          ))) : (
            <p className="text-center text-gray-500 col-span-full">
              {search.trim().length > 0
                ? `No lessons found for "${search}"`
                : "No lessons available."}
            </p>
          )}
      </div>
    </div>
  );
};
export default LessonsAdminClient;
