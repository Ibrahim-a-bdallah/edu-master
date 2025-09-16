export interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
  isPaid: boolean;
}