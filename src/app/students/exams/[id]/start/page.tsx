// app/exam/[id]/start/page.tsx
"use client";

import { useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  fetchExamDetails,
  fetchRemainingTime,
  fetchScoreExam,
  startExamAttempt,
} from "@/store/studentsExam/examSlice";

export default function ExamStartPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);
  const {
    loading,
    error,
    currentExam: examDetails,
    submitResult,
  } = useAppSelector((state) => state.exam);

  const examId = params.id as string;

  useEffect(() => {
    // Fetch exam details for preview
    dispatch(fetchExamDetails({ token, examId }));
    dispatch(fetchScoreExam({ token, examId }));
  }, [examId, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleStartExam = async () => {
    try {
      if (submitResult.success) {
        toast.error("Exam is expired");
        console.log("Exam is expired");
        return router.push(`/students/exams`);
      }
      // Start exam attempt
      console.log("Start");
      await dispatch(startExamAttempt({ token, examId })).unwrap();
      console.log("result");
      await dispatch(fetchExamDetails({ token, examId })).unwrap();
      await dispatch(fetchRemainingTime({ token, examId })).unwrap();

      console.log("success");

      toast.success("Exam started successfully");
      router.push(`/students/exams/${examId}/taking`);
    } catch (error: any) {
      toast.error(error || "Failed to start exam");
    }
  };

  if (error && !examDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/students/exams")}
            >
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b bg-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {examDetails?.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Exam Instructions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Exam Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Badge variant="secondary" className="w-full justify-center">
                Duration: {examDetails?.duration} minutes
              </Badge>
              <Badge variant="outline" className="w-full justify-center">
                Questions: {examDetails?.questions?.length}
              </Badge>
            </div>

            <Button
              onClick={handleStartExam}
              disabled={loading}
              className="w-full py-3 text-lg font-semibold"
            >
              {loading ? "Starting..." : "Start Exam Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
