"use client";

import { useEffect, useState, useCallback } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ExamProtection from "@/components/ExamProtection";
import QuestionNavigation from "@/components/QuestionNavigation";
import QuestionDisplay from "@/components/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks/hooks";
import { examService } from "@/app/api/exam";
import { endExam, submitAnswer } from "@/store/studentsExam/examSlice";

export default function ExamTakingPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useAppSelector((state) => state.auth);
  const { currentExam, answers, time } = useAppSelector((state) => state.exam);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const examId = params.id as string;

  const handleAutoSubmit = useCallback(() => {
    toast.info("Time is up! Auto-submitting exam...");
    handleSubmitExam();
  }, []);

  useEffect(() => {
    if (isInitialized) return;

    if (time && time.message === "Time is up") {
      toast.error("Time is up");
      redirect(`/students/exams`);
    }
    if (!currentExam || currentExam._id !== examId) {
      toast.error("No active exam found");
      router.push(`/students/exams/${examId}/start`);
      return;
    }

    setIsInitialized(true);
  }, [isInitialized, currentExam, examId, router]);

  const handleAnswerSubmit = useCallback(
    (questionId: string, selectedAnswer: string) => {
      dispatch(submitAnswer({ questionId, selectedAnswer }));
    },
    [dispatch]
  );

  const handleSubmitExam = useCallback(async () => {
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })
      );

      const response = await examService.submitExam(examId, answersArray);
      if (response.success) {
        toast.success(
          `Score: ${response.data.score}/${response.data.totalPoints}`
        );
        dispatch(endExam());
        router.push(`/students/exams/${examId}/result`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit exam");
    } finally {
      setSubmitting(false);
      setShowSubmitDialog(false);
    }
  }, [answers, examId, dispatch, router]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsArray.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (!currentExam || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const questionsArray = currentExam.questions;
  const currentQuestion = questionsArray[currentQuestionIndex];
  const currentQuestionDetails =
    typeof currentQuestion === "object" ? currentQuestion : null;
  const questionId =
    currentQuestionDetails?._id || currentQuestionIndex.toString();

  return (
    <>
      <ExamProtection onViolation={handleSubmitExam} />

      <div className="min-h-screen bg-gray-50">
        {/* Header with Progress Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentExam.title}
                </h1>
                <p className="text-gray-600">
                  Exam - {currentExam.duration} minutes
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold">
                  {time &&
                    time.data.remainingTime.minutes &&
                    `Time: ${time.data.remainingTime.minutes}:
                  ${time.data.remainingTime.seconds
                    .toString()
                    .padStart(2, "0")}`}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  End Exam
                </Button>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (Object.keys(answers).length / questionsArray.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>
                Progress: {Object.keys(answers).length}/{questionsArray.length}
              </span>
              <span>
                {Math.round(
                  (Object.keys(answers).length / questionsArray.length) * 100
                )}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <QuestionNavigation
            questionsCount={questionsArray.length}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
          />

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  Question {currentQuestionIndex + 1} of {questionsArray.length}
                  {currentQuestionDetails?.points &&
                    ` (${currentQuestionDetails.points} points)`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestionDetails && (
                  <QuestionDisplay
                    question={currentQuestionDetails}
                    currentAnswer={answers[questionId] || ""}
                    onAnswerSubmit={(answer) =>
                      handleAnswerSubmit(questionId, answer)
                    }
                    questionNumber={currentQuestionIndex + 1}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Exam Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the exam?
              {Object.keys(answers).length < questionsArray.length && (
                <div className="mt-2 text-amber-600">
                  You have {questionsArray.length - Object.keys(answers).length}{" "}
                  unanswered questions.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitExam}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
