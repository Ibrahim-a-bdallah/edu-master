"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchLessons } from "@/store/lessons/lessonSlice";
import LessonCard from "@/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { Lesson } from "@/app/types/lesson";

const LessonsClient = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector((state) => state.lessons);
  const { token } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // انتظر 300ms بعد توقف المستخدم عن الكتابة

    return () => clearTimeout(timer);
  }, [search]);

  // جلب الدروس مرة واحدة فقط عند التحميل الأول
  useEffect(() => {
    if (!token || lessons.length > 0) return;

    const loadLessons = async () => {
      await dispatch(fetchLessons({ token }));
    };
    loadLessons();
  }, [dispatch, token, lessons.length]); // إضافة lessons.length للتحكم

  // جلب الدروس عند البحث (مع debounce)
  useEffect(() => {
    if (!token || debouncedSearch.trim() === "") return;

    const searchLessons = async () => {
      await dispatch(fetchLessons({ token, title: debouncedSearch }));
    };
    searchLessons();
  }, [dispatch, token, debouncedSearch]);

  // استخدام useMemo للتصفية لتجنب إعادة الحساب غير الضرورية
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
        Lessons
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
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson: Lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            {debouncedSearch.trim().length > 0
              ? `No lessons found for "${debouncedSearch}"`
              : "No lessons available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonsClient;
