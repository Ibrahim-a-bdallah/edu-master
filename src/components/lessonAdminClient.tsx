"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchAdminLessonsPaginated } from "@/store/lessons/lessonAdminSlice";
import LessonCard from "@/components/LessonCard";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { Lesson } from "@/app/types/lesson";

const LessonsAdminClientWithPagination = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error, total, page, hasMore } = useAppSelector(
    (state) => state.lessonsAdmin
  );
  const { token } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20; // عدد الدروس في كل صفحة

  // Debounce للبحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // العودة للصفحة الأولى عند البحث
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // جلب البيانات مع Pagination
  useEffect(() => {
    const loadLessons = async () => {
      if (!token) return;

      await dispatch(
        fetchAdminLessonsPaginated({
          token,
          page: currentPage,
          limit,
          title: debouncedSearch || undefined,
        })
      );
    };

    loadLessons();
  }, [dispatch, token, currentPage, debouncedSearch]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading && lessons.length === 0) {
    return <p className="text-center py-8">Loading lessons...</p>;
  }

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

      <div className="mb-4 text-sm text-gray-600">
        Showing {lessons.length} of {total} lessons (Page {currentPage})
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessons.length > 0 ? (
          lessons.map((lesson: Lesson) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-600">Page {currentPage}</span>

        <button
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {loading && <p className="text-center py-4">Loading more lessons...</p>}
    </div>
  );
};

export default LessonsAdminClientWithPagination;
