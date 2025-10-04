// components/QuestionNavigation.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionNavigationProps {
  questionsCount: number;
  currentIndex: number;
  answers: { [questionId: string]: string };
  onQuestionSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function QuestionNavigation({
  questionsCount,
  currentIndex,
  answers,
  onQuestionSelect,
  onNext,
  onPrevious,
}: QuestionNavigationProps) {
  // Get answered questions count
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questionsCount) * 100;

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questionsCount - 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg">Questions</CardTitle>
          <Badge variant="secondary">
            {answeredCount}/{questionsCount}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-center mt-1">
          {Math.round(progressPercentage)}% Completed
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-5 gap-2 p-4">
            {Array.from({ length: questionsCount }).map((_, index) => {
              const questionNumber = index + 1;
              // إصلاح: استخدام questionId الحقيقي بدلاً من الرقم
              const questionId =
                Object.keys(answers)[index] || index.toString();
              const isAnswered =
                answers[questionId] !== undefined && answers[questionId] !== "";
              const isCurrent = index === currentIndex;

              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  className={`h-10 w-10 p-0 font-medium ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md"
                      : isAnswered
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  } transition-all duration-200 hover:scale-105`}
                  onClick={() => onQuestionSelect(index)}
                >
                  {questionNumber}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Navigation Buttons */}
        <div className="border-t p-4">
          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirstQuestion}
              className="flex items-center space-x-1 flex-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={isLastQuestion}
              className="flex items-center space-x-1 flex-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="border-t p-3 space-y-2 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded bg-blue-600"></div>
            <span className="text-gray-600">Current Question</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded bg-gray-300"></div>
            <span className="text-gray-600">Not Answered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
