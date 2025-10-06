// services/lessonService.ts
import api from "@/lib/axios";

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  price: number;
  isPaid: boolean;
  scheduledDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LessonsResponse {
  message: string;
  success: boolean;
  data: Lesson[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  video?: string;
  classLevel?: string;
  price?: number;
}

// Get all lessons
export const getLessons = async (): Promise<LessonsResponse> => {
  const response = await api.get("/lesson");
  return response.data;
};

// Update lesson
export const updateLesson = async (
  id: string,
  data: UpdateLessonData
): Promise<{ message: string; success: boolean; data: Lesson }> => {
  const response = await api.put(`/lesson/${id}`, data);
  return response.data;
};

// Delete lesson
export const deleteLesson = async (
  id: string
): Promise<{ message: string; success: boolean }> => {
  const response = await api.delete(`/lesson/${id}`);
  return response.data;
};
