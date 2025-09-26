"use client";
import { useEffect, useState, useMemo } from "react";
import { fetchAdminLessons } from "@/store/lessons/lessonAdminSlice";
import LessonCard from "@/components/LessonCard";
import { Lesson } from "@/app/types/lesson";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";

const LessonsAdminClient = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector(
    (state) => state.lessonsAdmin
  );
  const { token } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ نفس تحسينات البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ تحسين طلبات API للإدمن
  useEffect(() => {
    const loadLessons = async () => {
      if (!token) return;

      if (lessons.length === 0) {
        await dispatch(fetchAdminLessons(token));
      }
    };

    loadLessons();
  }, [dispatch, token, lessons.length]);

  // ✅ استخدام useMemo
  const filteredLessons = useMemo(() => {
    if (debouncedSearch.trim() === "") return lessons;

    return lessons.filter((lesson: Lesson) =>
      lesson.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [lessons, debouncedSearch]);

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
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* ✅ مؤشر للإدمن */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLessons.length} of {lessons.length} admin lessons
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson: Lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))
        ) : (
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
