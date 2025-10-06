// app/admin/lessons/page.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { actGetLessons } from "@/store/lessons/lessonAdminSlice";
import { Lesson } from "@/lib/lessonService";
import LessonCardAdmin from "@/components/Lessons/LessonCardAdmin";

export default function lessonAdminClient() {
  const dispatch = useAppDispatch();
  const {
    items: lessons,
    loading,
    error,
  } = useAppSelector((state) => state.lessonsAdmin);

  useEffect(() => {
    dispatch(actGetLessons());
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button onClick={() => dispatch(actGetLessons())} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Lessons</h1>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson: Lesson) => (
          <LessonCardAdmin key={lesson._id} lesson={lesson} />
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No lessons found.</p>
          <Button className="mt-4">Create Your First Lesson</Button>
        </div>
      )}
    </div>
  );
}
