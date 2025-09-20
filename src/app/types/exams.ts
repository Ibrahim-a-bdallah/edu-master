export type Exam = {
  _id: string;
  title: string;
  description: string;
  duration: number;
  createdBy: string;
  classLevel: string;
  isPublished: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  questions: [];
};