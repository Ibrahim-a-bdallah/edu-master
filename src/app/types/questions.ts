// app/types/questions.ts
export interface Question {
  _id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  exam: string; // Exam ID
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionState {
  questions: Question[];
  filteredQuestions: Question[];
  currentQuestion: Question | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  searchTerm: string;
  filterByExam: string | null;
}