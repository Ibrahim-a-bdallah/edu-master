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

export interface CreateLessonData {
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
}
