// lib/api/examService.ts

import api from "@/lib/axios";

export const examService = {
  // 1. Get specific exam details with questions
  async getExamDetails(token: string, examId: string) {
    const response = await api.get(`/exam/get/${examId}`, {
      headers: {
        token: token,
      },
    });
    return response.data;
  },

  // 2. Start exam
  async startExam(examId: string) {
    const response = await api.post(`/studentExam/start/${examId}`);
    return response.data;
  },

  // 3. Get remaining time
  async getRemainingTime({ token, examId }: { token: string; examId: string }) {
    const response = await api.get(
      `/studentExam/exams/remaining-time/${examId}`,
      {
        headers: {
          token: token,
        },
      }
    );
    console.log("Time", response.data);
    return response.data;
  },

  // 4. Submit exam
  async submitExam(
    examId: string,
    answers: Array<{ questionId: string; selectedAnswer: string }>
  ) {
    const response = await api.post(`/studentExam/submit/${examId}`, {
      answers,
    });
    return response.data;
  },
};
