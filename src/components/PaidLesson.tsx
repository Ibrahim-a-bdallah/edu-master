"use client";
import { useEffect } from "react";
function PaidLesson() {
  useEffect(() => {
     // Extract lessonId from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const lessonId = queryParams.get("lessonId");
    if (!lessonId) return;
    const stored = localStorage.getItem("paidLessons"); // Get paidLessons from localStorage
    const paidLessons = stored ? JSON.parse(stored) : []; // Parse or initialize as empty array
    if (!paidLessons.includes(lessonId)) {
      paidLessons.push(lessonId);
      localStorage.setItem("paidLessons", JSON.stringify(paidLessons));
    }
    console.log("Saved lesson:", lessonId);
  }, []);

  return null;
}

export default PaidLesson
