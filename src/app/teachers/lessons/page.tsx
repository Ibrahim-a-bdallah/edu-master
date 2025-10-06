"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { actGetLessons } from "@/store/lessons/lessonAdminSlice";
import { Button } from "@/components/ui/button";
import CreateLessonDialog from "@/components/Lessons/CreateLessonDialog";
import LessonCardAdmin from "@/components/Lessons/LessonCardAdmin";
import { Lesson } from "@/lib/lessonService";

export default function AdminLessonsPage() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const {
    items: lessons,
    loading,
    error,
  } = useAppSelector((state) => state.lessonsAdmin);

  useEffect(() => {
    dispatch(actGetLessons(token));
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
          <Button
            onClick={() => dispatch(actGetLessons(token))}
            className="mt-4"
          >
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
        <CreateLessonDialog />
      </div>

      <div className="grid  lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center">
        {lessons.map((lesson: Lesson) => (
          <LessonCardAdmin key={lesson._id} lesson={lesson} />
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No lessons found.</p>
          <CreateLessonDialog />
        </div>
      )}
    </div>
  );
}
